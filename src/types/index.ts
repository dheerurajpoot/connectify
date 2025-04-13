export interface User {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  online?: boolean;
  isVerified?: boolean;
}

export interface Message {
  _id: string;
  senderId: User;
  receiverId: User;
  content: string;
  read: boolean;
  createdAt: string;
}
