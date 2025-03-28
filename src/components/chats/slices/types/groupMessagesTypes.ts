export interface reactionType {
  user_id: string;
  type: string;
  timestamp: string;
}



export interface messages {
  _id: string;
  sender_id: string;
  createdAt: Date;
  group_id: string;
  message: string;
  iv: string;
  name: string;
  isReply: boolean;
  replyTo: string;
  isRead: [];
  isReceived: [];
  reactions:reactionType[];
}

export interface groupChats {
  _id: string;
  messages: Array<messages>;
}
