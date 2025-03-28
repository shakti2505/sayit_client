import React, { useCallback } from "react";
import {
  Send,
  CheckCheck,
  Plus,
  MicIcon,
  Sticker,
  X,
  UserPlus2,
  Info,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "../../../lib/socket.config";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store"; // Import AppDispatch type
import MobileChatSidebar from "../MobileChatSideBar";
import ChatSearchSheet from "./ChatSearchSheet";
import { decryptAESKey, decryptMessage } from "../../../crypto/decrypt";
import { encryptMessageWithAES } from "../../../crypto/encrypt";
import { GroupMembers } from "../slices/types/chatGroupTypes";
import { messages } from "../slices/types/groupMessagesTypes";
import { reactionType } from "../slices/types/groupMessagesTypes";
import { showNotification } from "../../../service worker/services";
import User_skeleton_loader from "../../common/Skeleton loader/User_skeleton_loader";
import axios from "axios";
import { GET_GROUP_CHATS_URL } from "../../../utilities/apiEndPoints";
import { useSearchParams } from "react-router-dom";
import MessageOptionDropDown from "./MesssageDropDownOption";
import ReactionComponent from "./ReactionComponent";
import { formatTime } from "../../../utilities/utilitiesFunctions";

const GroupChatV2: React.FC = () => {
  // const useAppDispatch: () => AppDispatch = useDispatch;
  // const dispatch = useAppDispatch(); // Typed dispatch

  const [aesKey, setAesKey] = useState<CryptoKey>();

  // scroll when new message appears
  const messageRef = useRef<HTMLDivElement>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  // group data
  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  // group chats
  const { groupChats } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupChat
  );
  // group chats
  const { updatedGroupDetails } = useSelector(
    (ChatGroups: RootState) => ChatGroups.updateChatGroupDetails
  );

  // state to pass data in the left sheet to show group details
  const [openSheet, setOpenSheet] = useState(false);

  // input message
  const [message, setMessage] = useState("");

  // messages array to store the old messages of group
  const [messages, setMessages] = useState<Array<messages>>([]);

  const [loading, setLoading] = useState(false);

  // typers state
  const [typer, setTyper] = useState<string>("");

  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group"); // Extract the value of "group_id"
  // const [loadingDecryptedMessages, setLoadingDecryptedMessages] =
  //   useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // state for replying on existing message
  const [hoverMessageId, setHoverMesssageId] = useState<string | null>("");
  const [isreply, setIsReply] = useState(false);
  const [messageReplyingOn, SetMessageReplyingOn] = useState<messages>();
  const sender = JSON.parse(localStorage.getItem("user") || "");

  // state for reactions to messages
  const [reactions, setReaction] = useState<reactionType[]>([]);
  // function to open group details side sheet
  const handleGroupDetailsSheet = () => {
    setOpenSheet(true);
  };

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current?.scrollIntoView({ behavior: "auto" });
    }
  };

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center", // Scroll until the message is fully visible
        inline: "nearest",
      });
      // Add the Tailwind pulse effect
      element.classList.add("animate-pulse-tw");

      // Remove the class after animation ends
      setTimeout(() => {
        element.classList.remove("animate-pulse-tw");
      }, 1000); // Match animation duration
    }
  };

  // create soket instance
  let socket = useMemo(() => {
    const socket = getSocket();
    socket.auth = {
      room: group_id,
    };
    return socket.connect();
  }, [group_id]);

  const getFirstName = (str: String) => {
    const res = str.split(" ");
    return res[0];
  };

  // handle message decryption with decrypted AesKey
  const handleMessageDecryption = async (key = aesKey) => {
    if (key && groupChats.length > 0) {
      const decryptedMessages = await Promise.all(
        groupChats.map(async (item: messages) => {
          // Call your async method that returns a promise
          const decryptedMessage = await decryptMessage(
            item.message,
            item.iv,
            key ?? aesKey
          );
          // Return a new object with the modified property
          return {
            ...item,
            message: decryptedMessage ?? "", // Replace encrypted message with decrypted one
          };
        })
      );

      if (decryptedMessages.length > 0) {
        setMessages(decryptedMessages);
      }
    }
  };

  const handleChange = async (msg: string) => {
    setMessage(msg);
    // firing an event to detect who is typing
    if (msg.length > 0) {
      socket.emit("typing", sender.name);
    }
    if (msg.length === 0) {
      socket.emit("notTyping", sender.name);
    }
  };

  // handle Reaction to messages
  const handleReactionToMessage = (
    messageId: string,
    groupId: string,
    type: string,
    user_id: string
  ) => {
    if (messageId && groupId) {
      const reactionData = {
        type,
        messageId,
        user_id,
        groupId,
      };
      socket.emit("reactionToMessage", reactionData);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isreply) setIsReply(false);
    socket.emit("notTyping", sender.name);
    if (aesKey) {
      const encryptedMsg = await encryptMessageWithAES(message, aesKey);
      if (encryptedMsg) {
        const payload: messages = {
          isRead: [],
          isReceived: [],
          _id: "",
          sender_id: sender.id,
          createdAt: new Date(),
          message: encryptedMsg.encryptedMessage,
          iv: encryptedMsg.iv,
          name: sender.name,
          group_id: group_id ?? "",
          isReply: isreply ? isreply : false,
          replyTo: isreply ? messageReplyingOn?._id ?? "" : "",
          reactions: reactions.length > 0 ? reactions : [],
        };
        socket.emit("message", payload);
        const payloadDecrypted: messages = {
          isRead: [],
          isReceived: [],
          _id: "",
          sender_id: sender.id,
          createdAt: new Date(),
          message: message,
          iv: encryptedMsg.iv,
          name: sender.name,
          group_id: group_id ?? "",
          isReply: isreply ? isreply : false,
          replyTo: isreply ? messageReplyingOn?._id ?? "" : "",
          reactions: reactions.length > 0 ? reactions : [],
        };
        setMessages((prev) => [payloadDecrypted, ...prev]);
        setMessage("");
        setTyper("");
      }
    } else {
      console.log("no aes key");
    }
  };

  const getDecryptedAesKey = async () => {
    try {
      const user = localStorage.getItem("user");
      const loggedInUser = user ? JSON.parse(user) : null;
      if (loggedInUser && chatGroups) {
        const res = chatGroups?.encryptAESKeyForGroup.find(
          (item: any) => item.user_id === loggedInUser.id
        )?.encryptedAESKey;
        if (res?.length !== 0) {
          const key = await decryptAESKey(res as string);
          setAesKey(key);
          return key;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGroupMessages = async () => {
    setLoading(true);
    try {
      if (group_id) {
        const res = await axios.get(
          GET_GROUP_CHATS_URL(group_id, page + 1, 10)
        );
        if (res.status === 200 && res.data.length > 0) {
          // decrypting messages
          if (aesKey) {
            const decryptedMessages = await Promise.all(
              res.data.map(async (item: messages) => {
                // Call
                // your async method that returns a promise
                const decryptedMessage = await decryptMessage(
                  item.message,
                  item.iv,
                  aesKey
                );
                // Return a new object with the modified property
                return {
                  ...item,
                  message: decryptedMessage ?? "", // Replace encrypted message with decrypted one
                };
              })
            );

            // now adding new decrypted messges in the local state
            if (decryptedMessages.length > 0) {
              setMessages((prevMessages) => [
                ...prevMessages,
                ...decryptedMessages,
              ]);
              setPage((prevPage) => prevPage + 1);
              setLoading(false);
            }
          } else {
            setHasMore(false);
            setLoading(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDecryptedAesKey = async () => {
    const key = await getDecryptedAesKey();
    if (key) {
      handleMessageDecryption(key);
    }
  };

  // when this components load fisrt aes key will be decrypted
  useEffect(() => {
    fetchDecryptedAesKey();
  }, []);

  // capturing the messase and adding it in the messages state with other messages
  useEffect(() => {
    socket.on("message", async (data) => {
      const key = await getDecryptedAesKey();

      if (data && key) {
        const decryptedMessage = await decryptMessage(
          data.message,
          data.iv,
          key
        );
        // const res = await updateMessgeStatus(data._id);
        const decryptedData: messages = {
          isRead: [],
          isReceived: [],
          _id: "",
          sender_id: data.sender_id,
          createdAt: data.createdAt,
          message: decryptedMessage ? decryptedMessage : "",
          iv: data.iv,
          name: data.name,
          group_id: data.group_id,
          isReply: isreply ? isreply : false,
          replyTo: isreply ? messageReplyingOn?.sender_id ?? "" : "",
          reactions: [],
        };
        setMessages((prevMessages) => [decryptedData, ...prevMessages]);
        // triggere notification
        showNotification("New Message", decryptedData.message);
      }
      // socket.emit("IsReceived", { received: true, receiverId: sender.id });
    });

    // caputuring isTyping event
    socket.on("isTyping", (name) => {
      setTyper(name);
    });

    // caputuring isTyping event
    socket.on("notTyping", () => {
      setTyper("");
    });

    // capturing reaction to message
    socket.on("reactionToMessage", (data) => {
      setReaction(data);
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  const firstMessageEleRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          await getGroupMessages();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [getGroupMessages]
  );

  const lastDateRef = useRef<string | null>(null);

  return (
    <Card className="relative flex-2 flex-grow bg-background overflow-y-auto rounded-none border-none ">
      {/* Card Header */}

      <CardHeader className="fixed top-0 flex flex-row items-center gap-3 w-full bg-background z-40 border-b border-opacity-10 ">
        <div className="md:hidden">
          <MobileChatSidebar />
        </div>
        <button
          className="flex flex-row items-center w-full space-x-4 hover:cursor-pointer"
          onClick={handleGroupDetailsSheet}
        >
          <div className="flex flex-row items-center w-full space-x-4 ">
            <Avatar>
              <AvatarImage
                src={
                  updatedGroupDetails
                    ? updatedGroupDetails.group_picture
                    : chatGroups?.group_picture
                    ? chatGroups.group_picture
                    : "https://github.com/shadcn.png"
                }
                alt="Image"
              />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start px-2 sticky">
              <p className="text-sm font-medium">
                {updatedGroupDetails?.name
                  ? updatedGroupDetails.name
                  : chatGroups?.name}
              </p>
              <div className="flex flex-row gap-2 mt-1">
                {chatGroups?.members.map((item: GroupMembers) => {
                  return (
                    <p
                      className="text-xs font-medium  text-muted-foreground"
                      key={item.member_id}
                    >
                      {getFirstName(item.member_name)}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </button>
      </CardHeader>
      <ChatSearchSheet
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        aesKey={aesKey}
      />

      <CardContent className="flex flex-col bg-background text-muted-foreground overflow-y-auto py-24 h-screen ">
        <div className="flex items-center justify-center gap-3 ">
          <div className="flex flex-col bg-muted items-center justify-center w-96 p-3 m-3 rounded-3xl shadow-sm">
            <img
              src={chatGroups?.group_picture}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex flex-row items-center justify-between gap-1 m-3">
              <p className="text-xs">{chatGroups?.members.length} Members.</p>
              <p className="text-xs">
                Created on{" "}
                {new Date(
                  chatGroups?.createdAt ? chatGroups?.createdAt : ""
                ).toLocaleDateString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                By{" "}
                {
                  chatGroups?.members.filter((mem) => mem.isAdmin)[0]
                    .member_name
                }
              </p>
            </div>
            <div className="flex flex-row justify-evenly items-center w-full">
              <button
                onClick={() => setOpenSheet(true)}
                className="flex items-center justify-center border border-gray-500 rounded-full p-2 text-cyan-500 hover:text-cyan-300 gap-1"
              >
                <Info size={20} />
                Group Info
              </button>
              <button className="flex items-center justify-center border border-gray-500 rounded-full p-2 text-cyan-500 hover:text-cyan-300  gap-1">
                <UserPlus2 size={20} />
                Add members
              </button>
            </div>
          </div>
        </div>
        {messages.length !== 0 || chatGroups
          ? [...messages].reverse().map((item, index) => {
              const currentDate = new Date(item.createdAt).toLocaleDateString(
                [],
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                }
              );

              let messageReplyTo: string = "";
              let memberReplyTo: string = "";
              if (isreply || item.isReply) {
                const replyMessage = messages.filter(
                  (msg) => msg._id === item.replyTo
                )[0];
                messageReplyTo = replyMessage ? replyMessage.message : "";
                memberReplyTo = replyMessage ? replyMessage.name : "";
              }

              // Check if the date has changed
              const showDate = lastDateRef.current !== currentDate;
              if (showDate) lastDateRef.current = currentDate;
              return (
                <React.Fragment key={item._id}>
                  {/* Messages for the Date */}
                  {showDate && (
                    <div className="sticky top-0 bg-background text-[11px] flex justify-center items-center gap-2 text-muted-foreground py-1">
                      {currentDate}
                    </div>
                  )}
                  {/* Messages for the Date */}

                  {/* message replies*/}
                  {isreply ||
                    (item.isReply && (
                      <>
                        <button
                          id={item._id}
                          onMouseEnter={() => setHoverMesssageId(item._id)}
                          onClick={() => scrollToMessage(item.replyTo)}
                          className={cn(
                            "flex min-w-40 max-w-96 flex-col gap-2 rounded-md px-2 py-2 text-sm shadow-cyan-300 shadow m-2 z-20",
                            item.name === sender.name
                              ? "bg-[hsl(var(--muted))] text-foreground self-end"
                              : "bg-muted text-foreground self-start"
                          )}
                        >
                          <div className="flex flex-row justify-between">
                            <p className="text-left text-cyan-500 font-bold">
                              {item.sender_id != sender.id && item.name}
                            </p>
                            {hoverMessageId === item._id && (
                              <MessageOptionDropDown
                                setIsReply={setIsReply}
                                SetMessageReplyingOn={SetMessageReplyingOn}
                                message={item}
                                handleReactionToMessage={
                                  handleReactionToMessage
                                }
                                sender_id={sender.id}
                              />
                            )}
                          </div>

                          <div className="flex flex-row items-center gap-2 bg-opacity-10 bg-cyan-300 rounded-r-md">
                            <div
                              className={
                                item.sender_id != sender.id
                                  ? "w-1 bg-[#e26ab6] h-12 rounded-l-md"
                                  : "w-1 bg-[#53bdeb] h-12 rounded-l-md"
                              }
                            ></div>
                            <div className="flex flex-col justify-start items-start p-1 ">
                              <div className="flex flex-row w-full items-center justify-between">
                                <p
                                  className={
                                    item.sender_id != sender.id
                                      ? "text-[#e26ab6]"
                                      : "text-[#53bdeb]"
                                  }
                                >
                                  {memberReplyTo}
                                </p>
                              </div>
                              <p>{messageReplyTo && messageReplyTo}</p>
                            </div>
                          </div>
                          <div className="flex flex-row  items-center gap-1">
                            <p className="text-foreground text-md">
                              {item.message}
                            </p>
                          </div>
                          <div className="flex flex-col items-end justify-end">
                            <p className="text-[11px]">
                              {new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </button>
                      </>
                    ))}

                  {/* message replies*/}
                  {!item.isReply && (
                    <>
                      <div
                        className={
                          item.name === sender.name
                            ? "self-end flex justify-between"
                            : "self-start flex justify-between gap"
                        }
                      >
                        {/* Show sender's profile pic if it's not the current user */}
                        {item.sender_id !== sender.id && (
                          <img
                            src={chatGroups?.group_picture}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                        )}

                        <div
                          id={item._id}
                          ref={index === 0 ? firstMessageEleRef : null}
                          onMouseEnter={() => setHoverMesssageId(item._id)}
                          className={cn(
                            "flex min-w-40 max-w-96 flex-col gap-2 px-2 py-1 mt-1 text-sm z-20",
                            item.name === sender.name
                              ? "bg-[hsl(var(--muted))] text-foreground  rounded-l-md rounded-b-md"
                              : "bg-[hsl(var(--muted))] text-foreground rounded-r-md rounded-b-md"
                          )}
                        >
                          {/* If it's a received message */}
                          {item.sender_id !== sender.id ? (
                            <>
                              {/* Name and dropdown */}
                              <div className="flex justify-between items-center h-4 border">
                                <span className="font-bold text-cyan-500 text-sm">
                                  {item.name}
                                </span>
                                {hoverMessageId === item._id && (
                                  <MessageOptionDropDown
                                    setIsReply={setIsReply}
                                    SetMessageReplyingOn={SetMessageReplyingOn}
                                    message={item}
                                    handleReactionToMessage={
                                      handleReactionToMessage
                                    }
                                    sender_id={sender.id}
                                  />
                                )}
                              </div>

                              {/* Message content */}
                              <span className="break-words text-xl">
                                {item.message}
                              </span>

                              {/* Time & check icon */}
                              <div className="flex justify-end text-[11px] items-center gap-2 text-muted-foreground">
                                {formatTime(item.createdAt)}
                                {item.sender_id === sender.id &&
                                  (item.isReceived.length > 0 ? (
                                    <CheckCheck size={20} color="cyan" />
                                  ) : (
                                    <CheckCheck size={20} />
                                  ))}
                              </div>
                            </>
                          ) : (
                            // If it's a sent message
                            <div className="flex justify-between gap-1">
                              <span className="break-words text-xl">
                                {item.message}
                              </span>

                              <div className="flex items-end gap-1 text-[10px] text-muted-foreground">
                                <span>{formatTime(item.createdAt)}</span>
                                {item.isReceived ? (
                                  <CheckCheck color="cyan" size={20} />
                                ) : (
                                  <CheckCheck size={20} />
                                )}
                              </div>
                              <div>
                                <MessageOptionDropDown
                                  setIsReply={setIsReply}
                                  SetMessageReplyingOn={SetMessageReplyingOn}
                                  message={item}
                                  handleReactionToMessage={
                                    handleReactionToMessage
                                  }
                                  sender_id={sender.id}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Show reactions if available */}
                      {item?.reactions?.length > 0 && (
                        <ReactionComponent message={item} />
                      )}
                    </>
                  )}

                  <div ref={messageRef} />
                </React.Fragment>
              );
            })
          : Array(5)
              .fill(0)
              .map((_, i) => (
                <div className="flex flex-col" key={i}>
                  <div className="self-start">
                    <User_skeleton_loader />
                  </div>
                  <div className="self-end">
                    <User_skeleton_loader />
                  </div>
                </div>
              ))}

        {typer && (
          <p className="text-muted-foreground bg-background animate-pulse text-xs">
            {typer} is typing.....
          </p>
        )}
      </CardContent>
      <CardFooter className=" flex flex-col absolute bottom-0 w-full bg-background border-t py-4  z-40 gap-2">
        {isreply && (
          <div className="flex flex-row items-center w-full gap-1">
            <div
              className={
                messageReplyingOn?.sender_id != sender.id
                  ? "w-1 bg-[#53bdeb] h-16 rounded-l-xl"
                  : "w-1 bg-[#e26ab6] h-16 rounded-l-xl"
              }
            ></div>
            <div className="flex flex-row items-center p-2 bg-background border-none w-full rounded-r-xl shadow">
              <div className="w-full">
                <p
                  className={
                    messageReplyingOn?.sender_id != sender.id
                      ? "text-[#53bdeb]"
                      : "text-[#e26ab6]"
                  }
                >
                  {messageReplyingOn?.sender_id !== sender.id
                    ? messageReplyingOn?.name
                    : "You"}
                </p>
                <p className="text-muted-foreground">
                  {messageReplyingOn?.message}
                </p>
              </div>
              <img src="https://github.com/shadcn.png" className="w-10 h-10" />
            </div>
            <button onClick={() => setIsReply(false)}>
              <X className="text-muted-foreground hover:cursor-pointer" />
            </button>
          </div>
        )}

        <div className="flex flex-row items-center gap-2 w-full">
          <Plus size={30} className="text-foreground hover:cursor-pointer" />
          <div className="flex flex-row items-center p-2 bg-background border w-full rounded-xl gap-2 shadow">
            <Sticker className="text-muted-foreground hover:cursor-pointer" />
            <input
              autoFocus
              id="message"
              placeholder="Type your message..."
              className="w-full outline-none text-muted-foreground bg-background p-1 text-base"
              autoComplete="off"
              value={message}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim().length > 0) {
                  e.preventDefault(); // Prevents unintended behavior like newline in textarea
                  handleSubmit(e); // Calls the submit function
                }
              }}
            />
            <Button
              onClick={handleSubmit}
              size="icon"
              className="bg-background"
              disabled={message.length === 0}
            >
              <Send className="text-foreground hover:cursor-pointer" />
            </Button>
          </div>
          <MicIcon className="text-muted-foreground hover:cursor-pointer" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default GroupChatV2;
