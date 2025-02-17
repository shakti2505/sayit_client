import React, { useEffect } from "react";
import ChatBase from "./ChatBase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getGroupsByID } from "../services/chatGroupServices";
import type { AppDispatch } from "../../../store/store"; // Import AppDispatch type
import { useDispatch } from "react-redux";
import { getGroupChatsByID } from "../services/groupChatsServices";

interface ChatPageProps {}

const ChatPage: React.FC<ChatPageProps> = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group_id"); // Extract the value of "group_id"
  console.log("group_id from chat page", group_id);
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  // fetching groups chat by id

  useEffect(() => {
    if (!group_id) {
      navigate("/not-found");
    }
  }, [group_id, navigate]);

  useEffect(() => {
    if (group_id) {
      dispatch(getGroupsByID(group_id));
      dispatch(getGroupChatsByID(group_id));
    }
  }, [group_id]);

  return (
    <>
      <ChatBase />
    </>
  );
};

export default ChatPage;
