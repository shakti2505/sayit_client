import React, { useEffect, useState } from "react";
import type { AppDispatch } from "../../store/store"; // Import AppDispatch type
import { useDispatch, useSelector } from "react-redux";
import { getAllGroupUsers } from "./services/chatGroupServices";
import { useParams } from "react-router-dom";
import type { RootState } from "../../store/store"; // Import AppDispatch type
// import User_skeleton_loader from "../common/Skeleton loader/User_skeleton_loader";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../components/ui/avatar";
// import { Button } from "../ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";

// import { ArrowLeft, UsersRound } from "lucide-react";
import GroupChatCard from "../groupChat/pages/GroupChatCard";
import { Search } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

// import UserAvatar from "../common/UserAvatar";

interface Props {
  // define your props here
}

const ChatSidebar: React.FC<Props> = () => {
  const [LastMessgesOfGroup, setLastMessageOfGroup] = useState({
    message: "",
    date: "",
  });

  // const navigate = useNavigate();
  const { group_id } = useParams();
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  // const { data } = useSelector(
  //   (ChatGroupUsers: RootState) => ChatGroupUsers.getAllGroupUsers
  // );

  const groupChats = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupChat
  );
  // const [user, setUser] = useState<{ name: string; image: string } | null>(
  //   null
  // );

  useEffect(() => {
    if (group_id) {
      dispatch(getAllGroupUsers(group_id));
    }
  }, []);

  useEffect(() => {
    // const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    // setUser(storedUser);

    // setting last message of the group to show in sidebar
    if (groupChats.data.length > 0) {
      setLastMessageOfGroup({
        message: groupChats.data[groupChats.data.length - 1].message,
        date: new Date(
          groupChats.data[groupChats.data.length - 1].createdAt
        ).toISOString(),
      });
    }
  }, []);

  return (
    <div className="flex-1 hidden md:block overflow-y-auto h-screen w-1/5  px-2 bg-background border-r-slate-600 border-r">
      <div className="flex flex-row px-8   items-center py-2 w-full">
        {/* <button
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer duration-200 hover:scale-125 active:scale-100"
          title="Go Back"
        >
          <ArrowLeft />
        </button> */}
        <div>
          <p className="text-lg font-bold">Chats</p>
        </div>
      </div>
      <div className="rounded-lg flex p-2 mx-5  bg-[#202C33] border-none">
        <Search />
        <input
          type="text"
          className=" w-full bg-[#202C33] border-none outline-none text-muted-foreground pl-2 text-base font-semibold outline-0"
          placeholder=""
          id=""
        />
      </div>
      <Tabs defaultValue="groups" className="p-2 ml-3 ">
        <TabsList className="gap-1 bg-background">
          <TabsTrigger className="rounded-full font-thin bg-muted" value="all">
            All
          </TabsTrigger>
          <TabsTrigger
            className="rounded-full font-thin bg-muted"
            value="unread"
          >
            Unread
          </TabsTrigger>
          <TabsTrigger
            className="rounded-full font-thin bg-muted"
            value="favourites"
          >
            Favourites
          </TabsTrigger>
          <TabsTrigger
            className="rounded-full font-thin bg-muted"
            value="groups"
          >
            Groups
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">.</TabsContent>
        <TabsContent value="password">.</TabsContent>
        <TabsContent value="groups">
          {" "}
          <GroupChatCard  />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatSidebar;
