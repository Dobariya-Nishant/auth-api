export type MultiCardQuery = {
  userId?: string;
  lastId?: string;
  category?: string[];
  limit?: number;
};

export type CardQuery = {
  id?: string;
  name?: string;
};
