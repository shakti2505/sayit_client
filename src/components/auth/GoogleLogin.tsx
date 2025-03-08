import React, { useState } from "react";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";
import { useNavigate, useSearchParams } from "react-router-dom";
import { googleAuth } from "./authServices";
import { Button } from "../ui/button";
import googlesvg from "../../assets/images/google.png";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { login } from "../../components/auth/authSlices";
import Loader from "../common/Loader";

const GoogleLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const groupid = searchParams.get("gorup_id");

  const responseGoogle = async (authResponse: CodeResponse) => {
    try {
      if (authResponse["code"]) {
        setLoading(true);
        // Use the separated service for Google authentication
        const result = await googleAuth(authResponse["code"]);
        const { name, email, image, _id, public_key } = result.user;
        // Dispatch the n action
        dispatch(
          login({
            email,
            image,
            _id,
            token: result.token,
            user: name,
          })
        );
        // Save the user data to the local storage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name,
            email,
            image,
            token: result.token,
            id: _id,
            public_key,
          })
        );

        // Redirect to the home page
        if (groupid) {
          navigate(`/chats?group_id=${groupid}`);
        } else {
          navigate("/chats");
          setLoading(false);
        }
      }
    } catch (err) {
      console.log("Error during Google login:", err);
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.log("Error during login:", error);
    },
    flow: "auth-code", // Ensure you're using the authorization code flow
  });

  return !loading ? (
    <Button className="text-foreground" variant="outline" onClick={googleLogin}>
      <img
        src={googlesvg}
        className=" mr-4"
        width={25}
        height={25}
        alt="google"
      />
      Continue with Google
    </Button>
  ) : (
    <Button
      disabled={true}
      className="text-foreground"
      variant="outline"
      onClick={googleLogin}
    >
      <Loader />
    </Button>
  );
};

export default GoogleLogin;
