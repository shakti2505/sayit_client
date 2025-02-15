export interface encryptAESKeysData {
  user_id: string;
  encryptedAESKey: string;
}

export interface GroupMembers {
  member_name:string;
  member_id: string;
  Public_key: string;
  member_image:string
  isAdmin:boolean;
}

export interface groupData {
  _id: string;
  group_id: string;
  name: string;
  user_id: string;
  passcode: string;
  created_At: string;
  members: Array<GroupMembers>;
  encryptAESKeyForGroup: Array<encryptAESKeysData>;
}


