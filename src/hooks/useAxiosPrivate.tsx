// This hook is to attach the intercepts with the axiosPrivate instance
import { useEffect } from "react";
import { axiosPrivate } from "../utilities/axios";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store"; // Import AppDispatch type

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const authState = useSelector((auth: RootState) => auth.auth);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (config.headers["Authorization"]) {
          config.headers["Authorization"] = authState.token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        // get prev request
        const prevRequest = error?.config;
        if (error?.response?.status == 401 && !prevRequest?.sent) {
          prevRequest.send = true; // to prevent infinate loop to refreshing token
          const newAccessToken = await refresh();
          prevRequest.hearders["authorization"] = newAccessToken;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
