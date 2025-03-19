import React, { useCallback } from "react";
import {
  Send,
  CheckCheck,
  Plus,
  MicIcon,
  Sticker,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "../../../lib/socket.config";
import {  useSelector } from "react-redux";
import type { RootState  } from "../../../store/store"; // Import AppDispatch type
import MobileChatSidebar from "../MobileChatSideBar";
import ChatSearchSheet from "./ChatSearchSheet";
import { decryptAESKey, decryptMessage } from "../../../crypto/decrypt";
import { encryptMessageWithAES } from "../../../crypto/encrypt";
import { GroupMembers } from "../slices/types/chatGroupTypes";
import { messages } from "../slices/types/groupMessagesTypes";
import { showNotification } from "../../../service worker/services";
import User_skeleton_loader from "../../common/Skeleton loader/User_skeleton_loader";
import axios from "axios";
import { GET_GROUP_CHATS_URL } from "../../../utilities/apiEndPoints";
import { useSearchParams } from "react-router-dom";



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

  // state to pass data in the left sheet to show group details
  const [openSheet, setOpenSheet] = useState(false);

  // input message
  const [message, setMessage] = useState("");

  // messages array to store the old messages of group
  const [messages, setMessages] = useState<Array<messages>>([]);

  //received encryptedMessages
  const [loading, setLoading] = useState(false);

  // typers state
  const [typer, setTyper] = useState<string>("");

  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group"); // Extract the value of "group_id"
  // const [loadingDecryptedMessages, setLoadingDecryptedMessages] =
  //   useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const sender = JSON.parse(localStorage.getItem("user") || "");

  // function to open group details side sheet
  const handleGroupDetailsSheet = () => {
    setOpenSheet(true);
  };

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current?.scrollIntoView({ behavior: "auto" });
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        };
        socket.emit("message", payload);
        const payloadDectypted: messages = {
          isRead: [],
          isReceived: [],
          _id: "",
          sender_id: sender.id,
          createdAt: new Date(),
          message: message,
          iv: encryptedMsg.iv,
          name: sender.name,
          group_id: group_id ?? "",
        };
        setMessages((prev) => [...prev, payloadDectypted]);
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
        const res = await axios.get(GET_GROUP_CHATS_URL(group_id, page+1, 10));
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
              console.log("messages", messages);
              console.log("decryptedMessages", decryptedMessages);
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
        };
        setMessages((prevMessages) => [...prevMessages, decryptedData]);
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

      <CardHeader className="fixed top-0 flex flex-row items-center gap-3 w-full bg-muted z-40">
        <div className="md:hidden">
          <MobileChatSidebar />
        </div>
        <button
          className="flex flex-row items-center w-full space-x-4 hover:cursor-pointer"
          onClick={handleGroupDetailsSheet}
        >
          <div className="flex flex-row items-center w-full space-x-4 ">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Image" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start px-2 sticky">
              <p className="text-sm font-medium">{chatGroups?.name}</p>
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

      <CardContent
        id="messageContent"
        className="flex flex-col bg-background text-muted-foreground overflow-y-auto py-24 h-screen "
      >
        {/* {hasMore && (
          <div
            ref={lastItemRef}
            className="text-center text-muted-foreground"
          ><Loader/></div>
        )} */}
        {messages.length !== 0
          ? [...messages].reverse().map((item, index) => {
              const currentDate = new Date(item.createdAt).toLocaleDateString(
                [],
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                }
              );

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
                  <div
                    ref={index === 0 ? firstMessageEleRef : null}
                    className={cn(
                      "flex w-max max-w-96 flex-col gap-2 rounded-2xl px-2 py-2 text-sm shadow-cyan-300 shadow-sm m-2 z-20",
                      item.name === sender.name
                        ? "bg-[hsl(var(--muted))] text-foreground self-end"
                        : "bg-muted text-foreground self-start"
                    )}
                  >
                    <span className="font-bold text-muted-foreground text-sm">
                      {item.name}
                    </span>
                    <span className="break-words text-xl">{item.message}</span>

                    <div className="flex flex-row justify-end">
                      <div className="text-[11px] flex flex-row items-center gap-2 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {item.isReceived ? (
                          <CheckCheck size={15} color="cyan" />
                        ) : (
                          <CheckCheck size={15} />
                        )}
                      </div>
                    </div>
                  </div>
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
      {/* Card Footer */}
      <CardFooter className="absolute bottom-0 w-full bg-muted py-4 gap-2 border-none z-40 ">
        <Plus size={30} className="text-foreground hover:cursor-pointer" />
        <div className="flex flex-row items-center p-2 bg-background border-none w-full rounded-xl gap-2 ">
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
      </CardFooter>
    </Card>
  );
};

export default GroupChatV2;
