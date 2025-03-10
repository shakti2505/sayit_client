// encrypt message with aes key
import { ContactsType } from "../components/chats/slices/types/groupMembersType";
import { deriveAESKeyFromPassword } from "./key_manager";
import { importPublicKeyFromBase64 } from "./utils";
export const encryptMessageWithAES = async (
  message: string,
  aesKey: CryptoKey
) => {
  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // initilization vector

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    encoder.encode(message)
  );
  // return {
  //   encryptedMessage: btoa(
  //     String.fromCharCode(...new Uint8Array(encryptedBuffer))
  //   ),
  //   iv: btoa(String.fromCharCode(...iv)), // converted IV to base64;
  // };
  return {
    encryptedMessage: ab2b64(encryptedBuffer),
    iv: ab2b64(iv),
  };
};

// encrypting aes key with new contacts public key
const encryptAESKeyWithPublicKey = async (
  aesKey: CryptoKey,
  UserPublicKey: string
) => {
  // Export AES key as raw buffer from cryptoKey format
  const aesKeyBuffer = await window.crypto.subtle.exportKey("raw", aesKey);

  // importing user's public key to crypto key use in encryption of aes key
  const importedUsersPublicKey = await importPublicKeyFromBase64(UserPublicKey);
  // checing availability of imported user's public key
  if (importedUsersPublicKey) {
    // encrypting aes key using the userspublic key
    const encryptedAESKeyBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      importedUsersPublicKey,
      aesKeyBuffer
    );

    // converting ecnrypted buffer to base64 and returing
    return btoa(String.fromCharCode(...new Uint8Array(encryptedAESKeyBuffer)));
  }
};

// function to encrypt the encrypt AES key to decrypt it again with the new group memebers public key
export const encryptedAESkeyWithUsersPublicKey = async (
  aesKey: CryptoKey,
  selectedUsers: ContactsType
) => {
  return selectedUsers.map(async (member) => ({
    user_id: member.contact_id, // Store user ID
    encryptedAESKey: await encryptAESKeyWithPublicKey(
      aesKey,
      member.contact_public_key
    ),
  }));
};

// encrypt the priate key using password-derived AES key
export const encryptPrivateKey = async (
  password: string,
  data: string
): Promise<{ encryptedData: string; iv: string; salt: string }> => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  // Generate a random salt and IV
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Derive an AES key from the password
  const aesKey = await deriveAESKeyFromPassword(password, salt);

  // Encrypt data using AES-GCM
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encodedData
  );

  return {
    encryptedData: btoa(
      String.fromCharCode(...new Uint8Array(encryptedBuffer))
    ), // Convert to Base64
    iv: btoa(String.fromCharCode(...iv)), // Store IV in Base64
    salt: btoa(String.fromCharCode(...salt)), // Store salt in Base64
  };
};

function ab2b64(arrayBuffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}


