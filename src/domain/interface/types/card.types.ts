export type MultiCardQuery = {
  userId?: string;
  lastId?: string;
  category?: string[];
  limit?: number;
};

export type CardQuery = {
  cardId: string;
  name: string;
};
