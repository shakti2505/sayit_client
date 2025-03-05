// generating private and public keys using web crypto API
export const genrateAndStoreKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true, // Keys are extractable
    ["encrypt", "decrypt"]
  );

  // export the private key
  const privateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  // save private key in IndexedDB
  await storePrivateKeyInIndexedDB(privateKey);

  // save publickey for sharing
  const exportedPublicKey = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );

  // Convert ArrayBuffer to a Base64 string
  const base64Key = btoa(
    String.fromCharCode(...new Uint8Array(exportedPublicKey))
  );

  // const formattedKey = base64Key.match(/.{1,64}/g)?.join("\n") || base64Key;
  return base64Key;
  // return `-----BEGIN PUBLIC KEY-----\n${formattedKey}\n-----END PUBLIC KEY-----`;
};

// retrieve private key
export const getPrivateKeyFromIndexedDB =
  async (): Promise<CryptoKey | null> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("sayIt_Database", 1);
      request.onsuccess = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transction = db.transaction("keys", "readonly");
        const store = transction.objectStore("keys");
        const getRequest = store.get("privateKey");
        getRequest.onsuccess = async () => {
          if (getRequest.result) {
            try {
              const privateKeyBuffer = getRequest.result;
              const privateKey = await window.crypto.subtle.importKey(
                "pkcs8",
                privateKeyBuffer.key,
                { name: "RSA-OAEP", hash: "SHA-1" },

                true, // extractable
                ["decrypt"]
              );
              resolve(privateKey);
            } catch (error) {
              reject(`Failed to import private key:${error}`);
            }
          } else {
            reject(null);
          }
        };
        getRequest.onerror = () => {
          reject("ERROR retrieving private key from indexed DB");
        };
      };
      request.onerror = () => {
        reject("error opening IndexeDB");
      };
    });
  };

// IndexedDB Helper: Store the Key
export const storePrivateKeyInIndexedDB = async (key: ArrayBuffer) => {
  const db = await openIndexedDB();
  const transaction = db.transaction("keys", "readwrite");
  const store = transaction.objectStore("keys");

  const request = store.put({ keyName: "privateKey", key });
  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () =>
      reject(new Error("Failed to store the private key in IndexedDB"));
  });
};
// indexedDB Helper: opend database
const openIndexedDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sayIt_Database", 1);

    // Triggered when the database is successfully opened
    request.onsuccess = () => {
      resolve(request.result);
    };

    // Triggered if an error occurs while opening the database
    request.onerror = () => {
      reject(new Error(`IndexedDB error: ${request.error?.message}`));
    };

    // Triggered if the database version changes (e.g., first creation or upgrade)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create the "keys" object store if it doesn't already exist
      if (!db.objectStoreNames.contains("keys")) {
        db.createObjectStore("keys", { keyPath: "keyName" });
      }
    };
  });
};

// generate AES key from the password -we derive a 256-bit AES key using PBKDF2.

export const deriveAESKeyFromPassword = async (
  password: string,
  salt: Uint8Array
) => {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000, // High iteration count for security
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};
