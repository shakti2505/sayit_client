import axios from "axios";
import {
  CLOUDNARY_URL,
  DELETE_GROUP_CHAT_URL,
  GET_GROUP_CHAT_URL,
  GROUP_CHAT_URL,
  UPDATE_GROUP_CHAT_URL,
} from "../../../utilities/apiEndPoints";
import { createChatSchemaType } from "../../../validations/groupChatValidation";
import { toast } from "sonner";
import { AppDispatch } from "../../../store/store";
import {
  createGroupChatFailure,
  createGroupChatStart,
  createGroupChatSuccess,
} from "../slices/groupChatSlice";
import {
  getGroupsStart,
  getGroupsSuccess,
  getGroupsFailure,
} from "../slices/getChatGroupSlice";
import {
  updateGroupStart,
  updateGroupSuccess,
  updateGroupFailure,
} from "../slices/updateChatGroupSlice";
import { addNewUserToGroup } from "../../chats/services/chatGroupServices";
import { axiosPrivate } from "../../../utilities/axios";

interface GroupMembers {
  contact_id: string;
  contact_public_key: string;
}

// fetching public_key from localstorage
const userData = localStorage.getItem("user");
const logged_in_user_data = userData ? JSON.parse(userData) : null;

// api call for the create chat group api
export const createChatGroup =
  (
    payload: createChatSchemaType,
    selectedUsers: Array<GroupMembers>,
    groupPicture: String
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(createGroupChatStart());
    try {
      const { data } = await axios.post(
        GROUP_CHAT_URL,
        {
          ...payload,
          key: logged_in_user_data.public_key,
          selectedUsers: selectedUsers,
          group_picture: groupPicture,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(createGroupChatSuccess(data));
      const groupUserPayload = {
        name: logged_in_user_data.name,
        group_id: data.data._id,
        user_id: data.data.group_admin,
      };
      // get groups of user;
      await dispatch(getGroups());
      // adding group admin to the group memeber's
      await dispatch(addNewUserToGroup(groupUserPayload));
      toast.success(data?.message);
      return data;
    } catch (error) {
      dispatch(createGroupChatFailure("Something went wrong"));
      toast.error("Something went wrong. Please try again!");
      return error;
    }
  };

// get groups
export const getGroups = () => async (dispatch: AppDispatch) => {
  dispatch(getGroupsStart());
  try {
    const { data } = await axiosPrivate.get(GET_GROUP_CHAT_URL, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(getGroupsSuccess(data.groups));
    toast.success(data?.message);
    return data;
  } catch (error) {
    dispatch(
      getGroupsFailure("Error in fetching chat groups, Please try again!")
    );
    return error;
  }
};

// delete group
export const deleteGroup = async (id: string) => {
  try {
    const { data } = await axios.delete(DELETE_GROUP_CHAT_URL(id), {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return error;
  }
};

// update group
export const updateChatGroup =
  (payload: createChatSchemaType, id: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateGroupStart());
    try {
      const { data } = await axios.put(
        UPDATE_GROUP_CHAT_URL(id),
        {
          ...payload,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(updateGroupSuccess(data));
      toast.success(data?.message);
      return data;
    } catch (error) {
      dispatch(updateGroupFailure("Something went wrong"));
      toast.error("Something went wrong. Please try again!");
      return error;
    }
  };

// upload group image
export const handleUploadGroupPicture = async (groupPicture: File) => {
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
  const FOLDER_NAME = import.meta.env.VITE_FOLDER_NAME;
  const CLOUDE_NAME = import.meta.env.VITE_CLOUDE_NAME;

  try {
    if (groupPicture) {
      let formData = new FormData();
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", FOLDER_NAME);
      formData.append("cloud_name", CLOUDE_NAME);
      formData.append("file", groupPicture);

      let response = await fetch(CLOUDNARY_URL(CLOUDE_NAME), {
        method: "post",
        body: formData,
      });
      if (!response.ok) {
        toast.error("failed to upload image");
        return;
      }
      const data = await response.json();
      return data.url;
    }
  } catch (error) {
    console.log(error);
  }
};
