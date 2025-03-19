import axios from "axios";
import { refreshAccessToken } from "../utilities/apiEndPoints";

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await axios.get(refreshAccessToken, {
      withCredentials: true,
    });
    return response.data.refreshToken;
  };

  return refresh;
};

export default useRefreshToken;
