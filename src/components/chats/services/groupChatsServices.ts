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
} from "../../../utilities/apiEndPoints";
import { toast } from "sonner";

// save chats
// export const saveChats = () => async (dispatch:AppDispatch) => {

//     dispatch(groupChatStart());
//     try {
//         const {data} = await axios.post()
//     } catch (error) {

//     }
// };

// get chats

export const getGroupChatsByID =
  (group_id: string) => async (dispatch: AppDispatch) => {
    dispatch(getGroupChatStart());
    try {
      const res = await axios.get(GET_GROUP_CHATS_URL(group_id));
      dispatch(getGroupChatsuccess(res.data.data));
      toast.success(res.data.message);
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
