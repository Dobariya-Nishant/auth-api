type UserQuery = {
  email?: string;
  userId?: string;
  userName?: string;
};

type MultiUserQuery = {
  userIds: Array<string>;
  lastId?: string;
  limit?: number;
};
