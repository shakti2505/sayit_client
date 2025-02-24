export interface Contact {
  user_id: string;
  contact_email: string;
  contact_id: string;
  contact_image: string;
  contact_name: string;
  contact_public_key: string;
}

export type ContactsType = Contact[];

export interface EncryptedAesKEyOfContacts {
  user_id: string | undefined;
  encryptedAESKey: string | undefined;
}

export type EncryptedAesKEyOfContactsType = EncryptedAesKEyOfContacts[];
