import axios from "axios";
import { refresh } from "../components/auth/authServices";

export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const local = localStorage.getItem("accessToken"); // or from cookies, or wherever you store it
let accessToken: string;
if (local) {
  accessToken = JSON.parse(local).token;
}
// creating axios private instance;
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  (config) => {
    if (config.headers["Authorization"]) {
      config.headers["Authorization"] = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
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
