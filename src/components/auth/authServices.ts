import axios from "axios";
import {
  genrateAndStoreKeyPair,
} from "../../crypto/key_manager";
import { GOOGLE_AUTH_URL, SAVE_PUBLIC_KEY } from "../../utilities/apiEndPoints";

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

export const googleAuth = async (
  authCode: string
): Promise<GoogleAuthResponse> => {
  try {
    // genrating and storing public key and private keys
    // const privateKey = await getPrivateKeyFromIndexedDB();
    const isExisting = (await window.indexedDB.databases())
      .map((db) => db.name)
      .includes("sayIt_Database");

    const authRequest = await axios.get(GOOGLE_AUTH_URL(authCode), {
      withCredentials: true,
    });

    if (!isExisting) {
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
