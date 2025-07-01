import { CardQuery, MultiCardQuery } from "@/domain/interface/types/card.types";
import { Card } from "@/domain/entities/card.entity";

export default interface ICardService {
  get(query: MultiCardQuery): Promise<Card[]>;

  getOne(query: CardQuery): Promise<Card | null>;

  create(user: Card): Promise<Card>;

  update(cardId: string, userUpdate: Partial<Card>): Promise<Card>;

  delete(query: CardQuery): Promise<Card>;
}
