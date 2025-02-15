export interface messages {
    _id: string;
    sender_id: string;
    createdAt: Date;
    group_id: string;
    message: string;
    iv:string
    name: string;
    isRead: boolean;
    isReceived: boolean;
  }
  [];

  export interface groupChats {
    _id: string;
    messages: Array<messages>;
  }