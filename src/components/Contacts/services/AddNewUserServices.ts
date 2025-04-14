import axios from "axios";
import {
  getNewUserStart,
  getNewUserFailed,
  getNewUserSuccess,
} from "../slices/addNewContactSlice";

import {
  getUserContactFailed,
  getUserContactSuccess,
  getUserContactStart,
} from "../slices/getAllContactsSlice";

import { AppDispatch } from "../../../store/store";
import {
  ADD_NEW_CONTACT,
  GET_USERS_CONTACTS,
  SEARCH_NEW_USER,
} from "../../../utilities/apiEndPoints";
import { toast } from "sonner";

export const searchNewUser =
  (query: string) => async (dispatch: AppDispatch) => {
    dispatch(getNewUserStart());
    try {
      const res = await axios.get(SEARCH_NEW_USER(query), {
        withCredentials: true,
      });
      if (res.status == 200) {
        dispatch(getNewUserSuccess(res.data));
        toast.success("User fetched");
      }
    } catch (error) {
      dispatch(getNewUserFailed("somthing went wrong"));
      toast.error("Error in fetching in user");
      console.log(error);
    }
  };

export const addNewContact = async (
  contact_id: string,
  contact_name: string,
  contact_image: string,
  contact_email: string,
  contact_public_key: string
) => {
  try {
    const res = await axios.post(
      ADD_NEW_CONTACT,
      {
        contact_id,
        contact_name,
        contact_image,
        contact_email,
        contact_public_key,
      },
      {
        withCredentials: true,
      }
    );
    if (res.status == 201) {
      toast.success(res.data.message);
      return res.data.message;
    }
  } catch (error) {
    toast.error("unable to add to Contact, Please try again!");
  }
};

export const getUsersContacts = () => async (dispatch: AppDispatch) => {
  dispatch(getUserContactStart());
  try {
    const res = await axios.get(GET_USERS_CONTACTS, {
      headers: {
        Accept: "application/json",
      },
      withCredentials: true,
    });
    if (res.status == 200) {
      dispatch(getUserContactSuccess(res.data.data));
      toast.success("Contacts fetched");
    }
  } catch (error) {
    dispatch(getUserContactFailed("somthing went wrong"));
    toast.error("Error in fetching in user Contact, please try again");
    console.log(error);
  }
};
