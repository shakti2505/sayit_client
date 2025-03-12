import React from "react";
import MobileChatSidebar from "./MobileChatSideBar";
import type { RootState } from "../../store/store"; // Import AppDispatch type
import { useSelector } from "react-redux";



const ChatNav: React.FC = () => {
  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  return (
    <nav className=" flex justify-between items-center px-6 py-2">
      <div className="flex space-x-4 md:space-x-0 items-center">
        <div className="md:hidden">
          <MobileChatSidebar />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
          {chatGroups?.name}
        </h1>
      </div>
    </nav>
  );
};

export default ChatNav;
