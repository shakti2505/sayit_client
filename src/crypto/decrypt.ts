// function to decrypt the AES keys using private key

import {
  deriveAESKeyFromPassword,
  getPrivateKeyFromIndexedDB,
} from "./key_manager";
import { base64ToArrayBuffer } from "./utils";

export const decryptAESKey = async (
  encrytedAESkeyBase64: string
): Promise<CryptoKey> => {
  try {
    // retrieve and import the private key
    const privateKey = await getPrivateKeyFromIndexedDB();
    if (!privateKey) throw new Error("Private key Not found in indexed DB");

    // convert base64string to arraybuffer
    const encrytedAESkeyBuffer = base64ToArrayBuffer(encrytedAESkeyBase64);
    //  Decrypt the AES key using the RSA private key
    const decryptedAESKeyBuffer = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encrytedAESkeyBuffer
    );
    // import decrypted AES key
    const aesKey = await window.crypto.subtle.importKey(
      "raw",
      decryptedAESKeyBuffer,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    return aesKey;
  } catch (error) {
    throw new Error(`Failed to decrypt AES key: ${error}`);
  }
};

export const decryptMessage = async (
  message: string,
  iv: string,
  AesKey: CryptoKey
) => {
  try {
    if (!message || !iv || !AesKey) {
      console.log(`provide all data to encrypt ${message} ${iv} ${AesKey}`);
    }
    // Convert IV from Base64 (or other format) to Uint8Array
    const ivBuffer = new Uint8Array(
      atob(iv) // Decode Base64 to binary
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Convert message from Base64 to Uint8Array
    const encryptedData = new Uint8Array(
      atob(message)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    const decryptedMessage = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBuffer },
      AesKey,
      encryptedData
    );

    const deCipher = new TextDecoder().decode(decryptedMessage);
    return deCipher;
  } catch (error) {
    console.log(`Error in decrypting Data: ${error}`);
  }
};

// decrypt private key with password

export const decryptPrivateKeyWithPassword = async (
  password: string,
  encryptedData: string,
  iv: string,
  salt: string
): Promise<string> => {
  const decoder = new TextDecoder();

  // Convert Base64 to Uint8Array
  const encryptedBuffer = new Uint8Array(
    atob(encryptedData)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const ivBuffer = new Uint8Array(
    atob(iv)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const saltBuffer = new Uint8Array(
    atob(salt)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  // Derive AES key from the password
  const aesKey = await deriveAESKeyFromPassword(password, saltBuffer);

  // Decrypt the data
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    aesKey,
    encryptedBuffer
  );

  console.log("decryptedBuffer", decryptedBuffer);

  return decoder.decode(decryptedBuffer);
};
