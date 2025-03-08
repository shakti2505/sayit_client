import GoogleLogin from "./GoogleLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuthWrapper = () => {
  // Access the Google Client ID from the environment variable
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin></GoogleLogin>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthWrapper;
