// function to convert the arrayBuffer
export const arrayBufferTobase64 = (buffer: ArrayBuffer) => {
  const uint8Array = new Uint8Array(buffer);
  const binaryString = String.fromCharCode(...uint8Array);
  return btoa(binaryString); // Base64 encode
};

// convert base64 to ArrayBuffer
export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64); // decode Base64;
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array.buffer;
};

export function formatPEM(base64String: string): string {
  const formattedKey = base64String.replace(/\s+/g, ""); // removing spaces
  return formattedKey;
}

// importing public key from base64 string to cryptoKey format
export const importPublicKeyFromBase64 = async (
  base64Key: string
): Promise<CryptoKey> => {
  // Convert Base64 to Uint8Array safely
  const encryptedAESKeyBuffer = new Uint8Array(
    atob(base64Key)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  // Import the public key
  return await window.crypto.subtle.importKey(
    "spki", // SubjectPublicKeyInfo format for public keys
    encryptedAESKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"] // The key will be used for encryption
  );
};
