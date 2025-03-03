import axios from "axios";
import { ADD_DEVICE_LINK_KEY } from "../../utilities/apiEndPoints";
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
    }
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};
