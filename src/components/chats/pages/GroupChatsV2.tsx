import * as React from "react";
import {
  Send,
  CheckCheck,
  CheckIcon,
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
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store"; // Import AppDispatch type
import { useSearchParams } from "react-router-dom";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/registry/new-york/ui/command"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../ui/dialog";
import MobileChatSidebar from "../MobileChatSideBar";
import ChatSearchSheet from "./ChatSearchSheet";
// import { SidebarTrigger } from "../../ui/sidebar";
// import { getGroupChatsByID } from "../services/groupChatsServices";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../../ui/tooltip";

// type User = (typeof users)[number];

// interface GroupChatProps {
//   searchMessage: string;
// }

type groupChatUserType = {
  name: string;
  group_id: string;
  chatGroup: string;
};

interface messages {
  _id: string;
  sender_id: string;
  createdAt: Date;
  group_id: string;
  message: string;
  name: string;
  isRead: boolean;
  isReceived: boolean;
}
[];

interface groupChats {
  _id: string;
  messages: Array<messages>;
}

const GroupChatV2: React.FC = () => {
  // const navigate = useNavigate();

  // gropchats data
  const groupChats = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupChat
  );

  // group data
  const { data } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  const [_, setSearchedMessageId] = useState("");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<groupChats>>([]);
  const [chatUser, setChatUser] = useState<groupChatUserType>();
  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group_id"); // Extract the value of "group_id"

  // const useAppDispatch: () => AppDispatch = useDispatch;
  // const dispatch = useAppDispatch(); // Typed dispatch

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const useAppDispatch: () => AppDispatch = useDispatch;
  //   const dispatch = useAppDispatch(); // Typed dispatch

  let socket = useMemo(() => {
    const socket = getSocket();
    socket.auth = {
      room: group_id,
    };
    return socket.connect();
  }, []);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    return () => {
      socket.close();
    };
  }, []);

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

  const handleChange = (msg: string) => {
    setMessage(msg);
    // setMessagereceived(false);
  };

  const sender = JSON.parse(localStorage.getItem("user") || "");
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: messages = {
      isRead: false,
      isReceived: false,
      _id: "",
      sender_id: sender.id,
      createdAt: new Date(),
      message: message,
      name: chatUser?.name ?? "Unknown",
      group_id: group_id ?? "",
    };
    socket.emit("message", payload, () => {});
    setMessage("");
    setMessages([...messages, { _id: payload._id, messages: [payload] }]);
  };

  // fetching the chat user from local storage and parsing the data, setting it to state variable, groud_id passed as dependency.
  useEffect(() => {
    if (group_id) {
      const data = localStorage.getItem(group_id);
      if (data) {
        const pData = JSON.parse(data);
        setChatUser(pData);
      }
    }
  }, [group_id]);

  useEffect(() => {
    // updading the local state with the redux state to store the previous messages
    setMessages(groupChats.data);
  }, [groupChats.data]);

  return (
    <>
      <Card className="flex-2 flex-grow flex-col h-full bg-background rounded-none border-none">
        {/* Card Header */}
        <CardHeader className="flex flex-row items-center bg-muted w-full py-5">
          <div className="flex flex-row items-center  w-full  space-x-4 ">
            <div className="flex flex-row items-center w-full space-x-4 ">
              <div className="md:hidden">
                <MobileChatSidebar />
              </div>
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Image" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{data?.name}</p>
                <p className="text-sm text-muted-foreground">m@example.com</p>
              </div>
            </div>
          </div>
          <ChatSearchSheet
            setSearchedMessageId={setSearchedMessageId}
            scrollToMessage={scrollToMessage}
          />
        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex-grow overflow-y-auto relative bg-background text-muted-foreground">
          <div
            className="flex flex-col-reverse overflow-y-auto 
      h-[20rem] sm:h-[25rem] md:h-[25.5rem] lg:h-[25.6rem] xl:h-[32rem] 
      p-2 sm:p-4 md:p-6"
          >
            <div ref={messagesEndRef} />
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
                          <div className="flex flex-col gap-2 ">
                            {(item.messages as messages[]).map((message) => (
                              <div
                                id={message._id}
                                key={message?._id}
                                className={cn(
                                  "flex w-max max-w-96 flex-col gap-2 rounded-lg px-3 py-2 text-sm ",
                                  message.name === chatUser?.name
                                    ? "ml-auto  bg-[hsl(var(--muted))] text-foreground "
                                    : " bg-muted text-foreground "
                                )}
                              >
                                <span className="font-bold text-blue-500 text-xs">
                                  {sender.name}
                                </span>
                                <span className="break-words text-md">
                                  {message.message}
                                </span>
                                <span className="break-words">{}</span>
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
                            ))}
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
        <CardFooter className="sticky bottom-0 bg-muted py-4 gap-2">
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
      <p className="text-foreground bg-background"> </p>
    </>
  );
};

export default GroupChatV2;
