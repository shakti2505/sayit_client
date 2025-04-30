import axios from "axios";
import PinnedMessages from "../pages/PinnedMessages";
import { PIN_MESSAGE } from "../../../utilities/apiEndPoints";

export const pinMessage = async (
  message_id: string,
  group_id: string,
  expireAfterTime: number
) => {
  try {
    const res = await axios.post(
      PIN_MESSAGE,
      {
        message_id: message_id,
        group_id: group_id,
        expireAfterTime: expireAfterTime,
      },
      {
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};
