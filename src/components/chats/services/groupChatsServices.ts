import axios from "axios";
// import {
//   groupChatStart,
//   groupChatfailure,
//   groupChatsuccess,
// } from "../slices/GroupChatsSlices";
import {
  getGroupChatStart,
  getGroupChatfailure,
  getGroupChatsuccess,
} from "../slices/getGroupChatsSlice";
import {
  getMessagesBySearchFailure,
  getMessagesBySearchSuccess,
  getMessagesBySearchStart,
} from "../slices/queryMessagesSlice";
import { AppDispatch } from "../../../store/store";
import {
  GET_GROUP_CHATS_URL,
  GET_MESSAGES_BY_SEARCH,
  UPDATE_MESSAGE_STATUS,
} from "../../../utilities/apiEndPoints";
import { toast } from "sonner";

// get chats

export const getGroupChatsByID =
  (group_id: string) => async (dispatch: AppDispatch) => {
    dispatch(getGroupChatStart());
    try {
      const res = await axios.get(GET_GROUP_CHATS_URL(group_id));
      dispatch(getGroupChatsuccess(res.data));
    } catch (error) {
      dispatch(getGroupChatfailure("failed to fetch chats"));
      return error;
    }
  };

// get searched messages
export const getMessgesBySearch =
  (group_id: string, queryMessage: string, page: number, limit: number) =>
  async (dispatch: AppDispatch) => {
    dispatch(getMessagesBySearchStart());
    try {
      const res = await axios.get(
        GET_MESSAGES_BY_SEARCH(group_id, queryMessage, page, limit)
      );
      dispatch(getMessagesBySearchSuccess(res.data));
      toast.success("messages fetched successfully by search!");
      return res;
    } catch (error) {
      dispatch(getMessagesBySearchFailure("failed to fetch messages"));
      return error;
    }
  };

export const updateMessgeStatus = async (messageId: string) => {
  try {
    const res = await axios.patch(
      UPDATE_MESSAGE_STATUS(messageId),
      {
        isRead: true,
      },
      {
        withCredentials: true,
      }
    );
    if (res.status !== 200) {
      toast.error("unable to update message status");
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};
