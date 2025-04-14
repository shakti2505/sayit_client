import { useState, useEffect } from "react";
import { getSocket } from "../lib/socket.config";
import type { RootState } from "../store/store"; // Import AppDispatch type
import { useSelector } from "react-redux";
import { messages } from "../components/chats/slices/types/groupMessagesTypes";

const useChatSocket = () => {
  const [allMessages, setAllMessages] = useState<messages[]>([]);

  // All group of user
  const { data } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getChatGroup
  );

  const socket = getSocket();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // listen messages
    socket.on("message", (data) => {
      setAllMessages((prev) => [...prev, data]);
    });

    // joins all the groups
    if (data.length > 0) {
      data.forEach((group) => {
        socket.auth = {
          room: group._id,
        };
      });
    }

    return () => {
      socket.close();
    };
  }, [data]);

  return { socket, allMessages };
};

export default useChatSocket;
