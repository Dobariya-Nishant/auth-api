export type SessionQuery = {
  userId: string;
  token: string;
};

export type MultiSessionQuery = {
  userId: string;
  lastId?: string;
  limit?: number;
};
