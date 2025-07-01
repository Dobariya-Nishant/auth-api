import { inject, injectable } from "tsyringe";
import { NotFoundError } from "@/domain/errors/app-errors";
import { userError } from "@/domain/messages/error/user.error";
import ICardRepository from "@/domain/interface/repositories/card.repository.interface";
import { CardQuery, MultiCardQuery } from "@/domain/interface/types/card.types";
import { Card } from "@/domain/entities/card.entity";

@injectable()
export default class CardService {
  constructor(
    @inject("UserRepository")
    private cardRepository: ICardRepository
  ) {}

  get(query: MultiCardQuery): Promise<Card[]> {
    query.limit = 20;
    return this.cardRepository.get(query);
  }

  async getOne(query: CardQuery): Promise<Card | null> {
    return this.cardRepository.getOne(query);
  }

  async create(user: Card): Promise<Card> {
    const newUser = await this.cardRepository.create(user);
    return newUser;
  }

  async update(cardId: string, userUpdate: Partial<Card>): Promise<Card> {
    const updatedCard = await this.cardRepository.update(cardId, userUpdate);

    if (!updatedCard) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    return updatedCard;
  }

  async delete(query: CardQuery): Promise<Card> {
    const deletedUser = await this.cardRepository.delete(query);

    if (!deletedUser) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    return deletedUser;
  }
}
