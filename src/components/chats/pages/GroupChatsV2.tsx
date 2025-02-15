import React from "react";
import {
  Send,
  CheckCheck,
  CheckIcon,
  Plus,
  MicIcon,
  Sticker,
  Search,
} from "lucide-react";
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
import { decryptMessage } from "../../../crypto/decrypt";
import { encryptMessageWithAES } from "../../../crypto/encrypt";
// import { SheetTrigger } from "../../ui/sheet";

// import Message_skeleton_Loader from "../../common/Skeleton loader/Message_skeleton_loader";

interface messages {
  _id: string;
  sender_id: string;
  createdAt: Date;
  group_id: string;
  message: string;
  iv: string;
  name: string;
  isRead: boolean;
  isReceived: boolean;
}
[];

interface groupChats {
  _id: string;
  messages: Array<messages>;
}

interface GroupChatProps {
  aesKey: CryptoKey;
}

const GroupChatV2: React.FC<GroupChatProps> = ({ aesKey }) => {
  // const useAppDispatch: () => AppDispatch = useDispatch;
  // const dispatch = useAppDispatch(); // Typed dispatch

  // group data
  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  // group chats
  const { groupChats } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupChat
  );

  // state to pass data in the left sheet to show group details
  const [searchSheet, setSearchSheet] = useState(false);
  const [openGroupDetails, setOpenGroupDetails] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  const [_, setSearchedMessageId] = useState("");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<groupChats>>([]);
  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group"); // Extract the value of "group_id"
  // const [loadingDecryptedMessages, setLoadingDecryptedMessages] =
  useState(false);

  const handleGroupDetailsSheet = () => {
    setOpenSheet(true);
    setSearchSheet(false);
    setOpenGroupDetails(true);
  };

  const handleSearchSheet = () => {
    setOpenSheet(true);
    setOpenGroupDetails(false);
    setSearchSheet(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let socket = useMemo(() => {
    const socket = getSocket();
    socket.auth = {
      room: group_id,
    };
    return socket.connect();
  }, [group_id]);

  // handle message decryption with decrypted AesKey
  const handleMessageDecryption = async () => {
    if (aesKey && groupChats.length > 0) {
      const decryptedMessages = await Promise.all(
        groupChats.map(async (msgByDate) => ({
          ...msgByDate,
          messages: await Promise.all(
            msgByDate.messages.map(async (item) => ({
              ...item,
              message:
                (await decryptMessage(item.message, item.iv, aesKey)) || "", // Decrypt message
            }))
          ),
        }))
      );
      setMessages(decryptedMessages);
      // setLoadingDecryptedMessages(false);
    }
  };

  // scroll to the selected Messages from the searchsheet
  const scrollToMessage = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" }); // Smoothly scroll to the element
      element.style.backgroundColor = "grey";
      setTimeout(() => {
        element.style.backgroundColor = "";
      }, 2000);
    }
  };

  const handleChange = async (msg: string) => {
    setMessage(msg);
  };

  const sender = JSON.parse(localStorage.getItem("user") || "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (aesKey) {
      const encryptedMsg = await encryptMessageWithAES(message, aesKey);
      if (encryptedMsg) {
        const payload: messages = {
          isRead: false,
          isReceived: false,
          _id: "",
          sender_id: sender.id,
          createdAt: new Date(),
          message: encryptedMsg.encryptedMessage,
          iv: encryptedMsg.iv,
          name: sender.name,
          group_id: group_id ?? "",
        };
        socket.emit("message", payload, () => {});
        const payloadDectypted: messages = {
          isRead: false,
          isReceived: false,
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
      }
    } else {
      console.log("no aes key");
    }
  };

  useEffect(() => {
    if (aesKey) {
      handleMessageDecryption();
    }
  }, [aesKey]);

  // capturing the messase and adding it in the messages state with other messages
  useEffect(() => {
    socket.on("message", async (data) => {
      if (aesKey) {
        const decryptedMessage = await decryptMessage(
          data.message,
          data.iv,
          aesKey
        );
        const decryptedData: messages = {
          isRead: data.isRead,
          isReceived: data.isReceived,
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
        scrollToBottom();
      }
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <>
      {groupChats.length > 0 ? (
        <Card className="flex-2 flex-grow bg-background  overflow-y-hidden rounded-none border-none ">
          {/* Card Header */}
          <CardHeader className="flex flex-row items-center bg-muted w-full py-5 ">
            <button
              className="flex flex-row items-center w-full space-x-4  hover:cursor-pointer"
              onClick={handleGroupDetailsSheet}
            >
              <div className="flex flex-row items-center w-full space-x-4 ">
                <div className="md:hidden">
                  <MobileChatSidebar />
                </div>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Image"
                  />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start px-2">
                  <p className="text-sm font-medium">{chatGroups?.name}</p>
                  <div className="flex flex-row gap-2 mt-1">
                    {chatGroups?.members.map((item) => {
                      return (
                        <p className="text-xs font-medium  text-muted-foreground  ">
                          {item.member_name}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </button>
            <ChatSearchSheet
              setSearchedMessageId={setSearchedMessageId}
              scrollToMessage={scrollToMessage}
              setOpenGroupDetails={setOpenGroupDetails}
              openGroupDetails={openGroupDetails}
              searchSheet={searchSheet}
              openSheet={openSheet}
              handleGroupDetailsSheet={handleGroupDetailsSheet}
              handleSearchSheet={handleSearchSheet}
              setOpenSheet={setOpenSheet}
              aeskey={aesKey}
            />
            <button onClick={handleSearchSheet}>
              <Search />
            </button>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="flex-grow overflow-y-auto bg-background text-muted-foreground">
            <div
              className="flex flex-col-reverse overflow-y-auto 
        h-[20rem] sm:h-[25rem] md:h-[25.5rem] lg:h-[25.6rem] xl:h-[31.5rem] 
        p-2 sm:p-4 md:p-6"
            >
              {/* <div ref={messagesEndRef} /> */}
              {messages.length !== 0 ? (
                <div className="flex flex-col gap-2 p-2 z-20">
                  {/* Render the grouped messages */}
                  {messages.map((item) => {
                    return (
                      <>
                        <React.Fragment key={item._id}>
                          <div className="text-background">
                            {/* Date Header */}
                            {item._id && (
                              <div className="flex flex-row justify-center items-center w-full sticky top-0 ">
                                <div className="p-1 px-3 my-4 text-xs bg-muted rounded-xl text-foreground ">
                                  {item._id}
                                </div>
                              </div>
                            )}

                            {/* Messages for the Date */}
                            <div
                              className="flex flex-col gap-2 "
                              key={item._id}
                            >
                              {(item.messages as messages[])?.map((message) => {
                                return (
                                  <>
                                    <div
                                      id={message._id}
                                      key={message._id}
                                      className={cn(
                                        "flex w-max max-w-96 flex-col gap-2 rounded-lg px-3 py-2 text-sm shadow-orange-100 shadow-sm",
                                        message.name === sender.name
                                          ? "bg-[hsl(var(--muted))] text-foreground self-end"
                                          : "bg-muted text-foreground self-start"
                                      )}
                                    >
                                      <span className="font-bold text-blue-500 text-xs">
                                        {message.name}
                                      </span>
                                      <span className="break-words text-md">
                                        {message.message}
                                      </span>
                                      {/* <span className="break-words">{}</span> */}
                                      <div className="flex flex-row justify-end">
                                        <div className="text-[11px] flex flex-row items-center gap-2">
                                          {new Date(
                                            message.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                          {message.isReceived ? (
                                            <CheckCheck />
                                          ) : (
                                            <CheckIcon />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div>
                        </React.Fragment>
                      </>
                    );
                  })}
                </div>
              ) : (
                <div className="text-foreground bg-background flex flex-row justify-center items-center rounded-md">
                  <p className="font-bold">Start new conversation...</p>
                </div>
              )}
            </div>
          </CardContent>
          {/* Card Footer */}
          <CardFooter className="bg-muted py-4 gap-2 border-none">
            <Plus size={30} className="text-foreground hover:cursor-pointer" />
            <div className="flex flex-row items-center p-2 bg-background border-none w-full rounded-xl gap-2 ">
              <Sticker className="text-muted-foreground hover:cursor-pointer" />
              <input
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
      ) : (
        <div className="flex flex-col justify-center items-center w-full">
          <div>Welcome to SayIt</div>
        </div>
      )}
    </>
  );
};

export default GroupChatV2;
