import axios from "axios";
import {
  ADD_DEVICE_LINK_KEY,
  GET_DATA_WITH_DEVICE_LINK_KEY,
} from "../../utilities/apiEndPoints";
import { toast } from "sonner";

export const addDeviceLinkKey = async (
  encryptedData: string,
  iv: string,
  salt: string
) => {
  try {
    const res = await axios.post(
      ADD_DEVICE_LINK_KEY,
      {
        encryptedData,
        iv,
        salt,
      },
      {
        withCredentials: true,
      }
    );
    if (res.status === 201) {
      toast.success(res.data.message);
      return res.data.key;
    }else if(res.status===200){
      toast.success(res.data.message);
      return res.data.key;
    }
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const getDataWithDeviceLinkKey = async (key: string) => {
  try {
    const res = await axios.get(GET_DATA_WITH_DEVICE_LINK_KEY(key), {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    console.log(error);
  }
};
