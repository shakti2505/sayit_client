
// encrypt message with aes key

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
  return {
    encryptedMessage: btoa(
      String.fromCharCode(...new Uint8Array(encryptedBuffer))
    ),
    iv: btoa(String.fromCharCode(...iv)), // converted IV to base64;
  };
};
