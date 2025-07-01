export interface Session {
  _id: string;
  userId: string;
  token: string;
  expiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
