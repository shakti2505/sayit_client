import * as React from "react";
import { Check, Plus, Send, CheckCheck, CheckIcon } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "../../../lib/socket.config";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store"; // Import AppDispatch type
import { useParams } from "react-router-dom";
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
import { Input } from "../../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/avatars/01.png",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
    avatar: "/avatars/02.png",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "/avatars/04.png",
  },
] as const;

type User = (typeof users)[number];

interface GroupChatProps {
  searchMessage: string;
}
type groupChatUserType = {
  name: string;
  group_id: string;
  chatGroup: string;
};

type messageType = {
  _id: string;
  sender_id: string;
  createdAt: Date;
  group_id: string;
  message: string;
  name: string;
  isRead: boolean;
  isReceived: boolean;
};

export const GroupChatV2: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const groupChats = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupChat
  );

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<messageType>>(groupChats.data);
  // const [messageReceived, setMessagereceived] = useState(false);
  const [chatUser, setChatUser] = useState<groupChatUserType>();
  const { group_id } = useParams();
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

  const handleChange = (msg: string) => {
    setMessage(msg);
    // setMessagereceived(false);
  };

  let groupedMessages;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const sender = JSON.parse(localStorage.getItem("user") || "");
    const payload: messageType = {
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
    setMessages([...messages, payload]);
  };

  // function to group message by date
  const groupMessagesByDate = (messages: messageType[]) => {
    return messages.reduce<Record<string, messageType[]>>((groups, message) => {
      const dateKey = new Date(message.createdAt).toDateString(); // Group by "D"
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message); // Add message to the respective date
      return groups;
    }, {});
  };
  groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <Card className="flex flex-col grow max-sm:h-screen ">
        {/* Card Header */}
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="Image" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-sm text-muted-foreground">m@example.com</p>
            </div>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="ml-auto rounded-full"
                  onClick={() => setOpen(true)}
                >
                  <Plus />
                  <span className="sr-only">New message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>New message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex-grow ">
          <div className="flex-1 flex flex-col-reverse overflow-y-auto max-sm:h-[25rem] md:h-[25.5rem] lg:h-[25.6rem] xl:h-[32rem]">
            <div ref={messagesEndRef} />
            {messages.length !== 0 ? (
              <div className="flex flex-col gap-2  p-2">
                {
                  // Render the grouped messages
                  Object.entries(groupedMessages).map(
                    ([date, messagesForDate]) => {
                      if (messagesForDate[0].group_id === group_id) {
                        return (
                          <React.Fragment key={date}>
                            <div className="">
                              {/* Date Header */}
                              <div className="flex flex-row justify-center items-center w-full sticky top-0">
                                <div className="p-1 px-3  text my-4 text-xs bg-[#18181B] rounded-xl text-white">
                                  {date}
                                </div>
                              </div>

                              {/* Messages for the Date */}
                              <div className="flex flex-col gap-2">
                                {messagesForDate
                                  .filter((message) =>
                                    message.message.toLowerCase().includes("")
                                  )
                                  .map((item) => {
                                    return (
                                      <>
                                        <div
                                          key={item?._id}
                                          //   className={`rounded-lg p-2 inline-block max-w-[45%] ${
                                          //     item.name === chatUser?.name
                                          //       ? "bg-primary text-primary-foreground self-end"
                                          //       : "bg-gradient-to-r from-gray-200 to-gray-300 text-black self-start"
                                          //   }`}
                                          className={cn(
                                            "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                            item.name === chatUser?.name
                                              ? "ml-auto bg-primary text-primary-foreground"
                                              : "bg-muted"
                                          )}
                                        >
                                          <span className="break-words">
                                            {item.message}
                                          </span>
                                          <div className="flex flex-row justify-end">
                                            <div className="text-[11px] flex flex-row items-center gap-2">
                                              {new Date(
                                                item.createdAt
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                              {item.isReceived ? (
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
                        );
                      }
                    }
                  )
                }
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 rounded-md">
                <div>
                  <p className="text-white font-bold">
                    Start new conversation...{" "}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={message}
              onChange={(e) => handleChange(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={message.length === 0}>
              <Send />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      {/* <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
              Invite a user to this thread. This will create a new group
              message.
            </DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="p-2">
                {users.map((user) => (
                  <CommandItem
                    key={user.email}
                    className="flex items-center px-2"
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(
                          selectedUsers.filter(
                            (selectedUser) => selectedUser !== user
                          )
                        )
                      }

                      return setSelectedUsers(
                        [...users].filter((u) =>
                          [...selectedUsers, user].includes(u)
                        )
                      )
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} alt="Image" />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    {selectedUsers.includes(user) ? (
                      <Check className="ml-auto flex h-5 w-5 text-primary" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar
                    key={user.email}
                    className="inline-block border-2 border-background"
                  >
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select users to add to this thread.
              </p>
            )}
            <Button
              disabled={selectedUsers.length < 2}
              onClick={() => {
                setOpen(false)
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
};
