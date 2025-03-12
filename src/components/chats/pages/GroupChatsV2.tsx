import React from "react";
import { Send, CheckCheck, Plus, MicIcon, Sticker } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "../../../lib/socket.config";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store"; // Import AppDispatch type
import { useSearchParams } from "react-router-dom";
import MobileChatSidebar from "../MobileChatSideBar";
import ChatSearchSheet from "./ChatSearchSheet";
import { decryptAESKey, decryptMessage } from "../../../crypto/decrypt";
import { encryptMessageWithAES } from "../../../crypto/encrypt";
import { GroupMembers } from "../slices/types/chatGroupTypes";
import { messages } from "../slices/types/groupMessagesTypes";
import { showNotification } from "../../../service worker/services";
import User_skeleton_loader from "../../common/Skeleton loader/User_skeleton_loader";

interface groupChats {
  _id: string;
  messages: Array<messages>;
}

const GroupChatV2: React.FC = () => {
  // const useAppDispatch: () => AppDispatch = useDispatch;
  // const dispatch = useAppDispatch(); // Typed dispatch
  const [aesKey, setAesKey] = useState<CryptoKey>();
  const messageRef = useRef<HTMLDivElement>(null);

  // group data
  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  // group chats
  const { groupChats, loadingGroupChats } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupChat
  );

  // state to pass data in the left sheet to show group details
  const [openSheet, setOpenSheet] = useState(false);

  // input message
  const [message, setMessage] = useState("");

  // message ref to scroll when new messsage appears
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // messages array to store the old messages of group
  const [messages, setMessages] = useState<Array<groupChats>>([]);

  // typers state
  const [typer, setTyper] = useState<string>("");

  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group"); // Extract the value of "group_id"
  const [loadingDecryptedMessages, setLoadingDecryptedMessages] =
    useState(false);

  const sender = JSON.parse(localStorage.getItem("user") || "");

  // function to open group details side sheet
  const handleGroupDetailsSheet = () => {
    setOpenSheet(true);
  };

  //
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
  const handleMessageDecryption = async (key: CryptoKey) => {
    setLoadingDecryptedMessages(true);
    if (key && groupChats.length > 0) {
      const decryptedMessages = await Promise.all(
        groupChats.map(async (msgByDate: any) => ({
          ...msgByDate,
          messages: await Promise.all(
            msgByDate.messages.map(async (item: any) => ({
              ...item,
              message: await decryptMessage(item.message, item.iv, key), // Decrypt message
            }))
          ),
        }))
      );
      setMessages(decryptedMessages);
      setLoadingDecryptedMessages(false);
    }
  };

  const handleChange = async (msg: string) => {
    setMessage(msg);
    // firing and event to detect who is typing
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
        setMessages((prev) => [
          ...prev,
          { _id: payload._id, messages: [payloadDectypted] },
        ]);

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

  // when this components load the fisrt aes key will be decrypted
  useEffect(() => {
    const fetchDecryptedAesKey = async () => {
      const key = await getDecryptedAesKey();
      if (key) {
        handleMessageDecryption(key);
      }
    };
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
        setMessages((prevMessages) => [
          ...prevMessages,
          { _id: data._id, messages: [decryptedData] },
        ]);
        // updating message status
        scrollToBottom();

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

  return (
    <>
      <Card className="relative flex-2 flex-grow bg-background overflow-y-auto rounded-none border-none">
        {/* Card Header */}

        <CardHeader className="fixed flex flex-row items-center gap-3 bg-muted w-full z-40">
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

        <CardContent className="flex-grow overflow-y-auto bg-background text-muted-foreground">
          <div className="flex flex-col-reverse overflow-y-auto h-lvh">
            {messages.length !== 0 && (
              <div className="flex flex-col gap-2 px-5 py-16">
                {/* Render the grouped messages */}
                {!loadingGroupChats && !loadingDecryptedMessages
                  ? messages.map((item) => {
                      return (
                        <React.Fragment key={item._id}>
                          <div className="text-background">
                            {/* Date Header */}
                            {item._id && (
                              <div className="flex flex-row justify-center items-center w-full sticky top-0">
                                <div className="p-1 px-3 my-4 text-xs bg-muted rounded-xl text-foreground ">
                                  {item._id}
                                </div>
                              </div>
                            )}

                            {/* Messages for the Date */}
                            <div className="flex flex-col gap-2">
                              {(item.messages as messages[])?.map((message) => {
                                if (message.group_id === group_id) {
                                  return (
                                    <div
                                      id={message._id}
                                      key={message._id}
                                      className={cn(
                                        "flex w-max max-w-96 flex-col gap-2 rounded-2xl px-2 py-2 text-sm shadow-cyan-300 shadow-sm",
                                        message.name === sender.name
                                          ? "bg-[hsl(var(--muted))] text-foreground self-end"
                                          : "bg-muted text-foreground self-start"
                                      )}
                                    >
                                      <span className="font-bold text-muted-foreground text-sm">
                                        {message.name}
                                      </span>
                                      <span
                                        style={{ scrollBehavior: "smooth" }} // Smooth scrolling
                                        ref={messageRef}
                                        id="messageSpan"
                                        className="break-words text-xl"
                                      >
                                        {message.message}
                                      </span>
                                      {/* <span className="break-words">{}</span> */}
                                      <div className="flex flex-row justify-end">
                                        <div className="text-[11px] flex flex-row items-center gap-2 text-muted-foreground">
                                          {new Date(
                                            message.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                          {message.isReceived ? (
                                            <CheckCheck
                                              size={15}
                                              color="cyan"
                                            />
                                          ) : (
                                            <CheckCheck size={15} />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  : messages.map(() => {
                      return (
                        <div className="flex flex-col">
                          <div className="self-start">
                            <User_skeleton_loader />
                          </div>
                          <div className="self-end">
                            <User_skeleton_loader />
                          </div>
                          <div className="self-start">
                            <User_skeleton_loader />
                          </div>
                          <div className="self-end">
                            <User_skeleton_loader />
                          </div>
                        </div>
                      );
                    })}
                {typer && (
                  <p className="text-muted-foreground bg-background animate-pulse text-xs">
                    {typer} is typing.....
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        {/* Card Footer */}
        <CardFooter className="absolute bottom-0 w-full bg-muted py-4 gap-2 border-none z-40">
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
    </>
  );
};

export default GroupChatV2;
