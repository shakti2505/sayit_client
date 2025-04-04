import axios from "axios";
import { genrateAndStoreKeyPair } from "../../crypto/key_manager";
import {
  CREATE_PASSWORD,
  GOOGLE_AUTH_URL,
  LOGIN_WITH_EMAIL_PASSWORD,
  LOGOUT_USER,
  refreshAccessToken,
  SAVE_PUBLIC_KEY,
  SIGNUP_WITH_EMAIL_PASSWORD,
  VERIFY_PASSWORD_FOR_QR_CODE_GENERATION,
} from "../../utilities/apiEndPoints";
import { toast } from "sonner";
import { SignupSchemaType } from "../../validations/authValidation/SignupformValidation";
import { LoginSchemaType } from "../../validations/authValidation/loginFormValidation";

// const BASE_URL = "http://localhost:8080";

interface GoogleAuthResponse {
  user: {
    name: string;
    email: string;
    image: string;
    _id: string;
    public_key: string;
  };
  token: string;
}

let isPrivateKeyExist: boolean;
const checkPrivateKeyExistence = async () => {
  const databases = await window.indexedDB.databases();
  return databases.map((db) => db.name).includes("sayIt_Database");
};
checkPrivateKeyExistence().then((exists) => {
  isPrivateKeyExist = exists;
});

// const isPrivateKeyExist = (await window.indexedDB.databases())
//   .map((db) => db.name)
//   .includes("sayIt_Database");

const genrateKeyPairAndSavePublicKey = async () => {
  const key = await genrateAndStoreKeyPair();
  await axios.patch(
    SAVE_PUBLIC_KEY,
    { public_key: key },
    {
      withCredentials: true, //
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const googleAuth = async (
  authCode: string
): Promise<GoogleAuthResponse> => {
  try {
    const authRequest = await axios.get(GOOGLE_AUTH_URL(authCode), {
      withCredentials: true,
    });

    if (!isPrivateKeyExist) {
      genrateKeyPairAndSavePublicKey();
    }

    // executing both request concurrently
    const [authResponse] = await Promise.all([authRequest]);

    return authResponse.data;
  } catch (error: any) {
    console.error(
      "Error during Google authentication:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Google login failed");
  }
};

// export const updatePublicKey = async () => {
//   try {
//     // Generating and storing public and private keys
//     const key = await genrateAndStoreKeyPair();

//     if (!key) {
//       throw new Error("Failed to generate the public key.");
//     }

//     // Sending the public key to the server with credentials
//     const response = await axios.patch(
//       SAVE_PUBLIC_KEY,
//       { public_key: key },
//       {
//         withCredentials: true, //
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.status === 200) {
//       console.log("Public key updated successfully:", response.data);
//     } else {
//       console.error("Failed to update public key:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error updating public key");
//   }
// };

// signup with email and password
export const signupWithEmail = async (payload: SignupSchemaType) => {
  try {
    const signupRes = await axios.post(SIGNUP_WITH_EMAIL_PASSWORD, {
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });
    if (signupRes.status === 201) {
      toast.success(signupRes.data.message);
      return signupRes.data.message;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    return error.response.data.message;
  }
};

export const loginWithEmail = async (payload: LoginSchemaType) => {
  try {
    const loginRes = await axios.post(
      LOGIN_WITH_EMAIL_PASSWORD,
      {
        email: payload.email,
        password: payload.password,
      },
      {
        withCredentials: true,
      }
    );
    if (loginRes.status === 200) {
      toast.success(loginRes.data.message);
      if (!isPrivateKeyExist) {
        genrateKeyPairAndSavePublicKey();
      }
      return loginRes.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.post(LOGOUT_USER, {}, { withCredentials: true });
    if (res.status === 200) {
      toast.success(res.data.message);
      return res.data.message;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createPasswordAuth = async (password: string) => {
  try {
    const res = await axios.patch(
      CREATE_PASSWORD,
      { password },
      { withCredentials: true }
    );
    if (res.status === 201) {
      toast.success(res.data.message);
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

// verify user and password for QR code generation to link the devices

export const verifyPassword = async (password: string) => {
  try {
    const res = await axios.post(
      VERIFY_PASSWORD_FOR_QR_CODE_GENERATION,
      {
        password,
      },
      {
        withCredentials: true,
      }
    );
    if (res.status === 200) {
      toast.success(res.data.message);
      return res.data.message;
    }
  } catch (error) {
    toast.error("Internal Server error");
    console.log(error);
  }
};

export const refresh = async () => {
  const response = await axios.get(refreshAccessToken, {
    withCredentials: true,
  });
  return response.data.refreshToken;
};
