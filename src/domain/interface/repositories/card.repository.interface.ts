import { CardQuery } from "@/domain/interface/types/card.types";
import { Card } from "@/domain/entities/card.entity";
import { MultiCardQuery } from "@/domain/interface/types/card.types";

export default interface ICardRepository {
  get(query: MultiCardQuery): Promise<Card[]>;

  getOne({ cardId, name }: CardQuery): Promise<Card | null>;

  create(session: Card): Promise<Card>;

  update(cardId: string, updateCard: Partial<Card>): Promise<Card | null>;

  delete({ cardId, name }: CardQuery): Promise<Card | null>;
}
