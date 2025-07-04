import { injectable } from "tsyringe";
import { QueryOptions } from "mongoose";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { userError } from "@/domain/messages/error/user.error";
import { getObjectId } from "@/domain/helpers/objectId";
import { CardQuery } from "@/domain/interface/types/card.types";
import { CardModel } from "@/infrastructure/db/mongodb/models/card.model";
import { Card } from "@/domain/entities/card.entity";
import { MultiCardQuery } from "@/domain/interface/types/card.types";

@injectable()
export default class CardRepository {
  get({ limit = 0, userId, lastId }: MultiCardQuery): Promise<Card[]> {
    const query: QueryOptions = {};

    if (userId) {
      query["userId"] = getObjectId(userId);
    }

    if (lastId) {
      query["_id"] = { $lt: getObjectId(lastId) };
    }

    return CardModel.find(query).limit(limit).sort({ createdAt: -1 }).lean();
  }

  async getOne({ id, name }: CardQuery): Promise<Card | null> {
    if (!id && !name) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const query: QueryOptions = {};

    if (id) {
      query["_id"] = getObjectId(id);
    }

    if (name) {
      query["name"] = name;
    }

    return CardModel.findOne(query).lean();
  }

  create(session: Card): Promise<Card> {
    return CardModel.create(session);
  }

  update(cardId: string, updateCard: Partial<Card>): Promise<Card | null> {
    const cardObjectId = getObjectId(cardId);

    return CardModel.findOneAndUpdate({ _id: cardObjectId }, updateCard, {
      new: true,
    }).lean();
  }

  delete({ id, name }: CardQuery): Promise<Card | null> {
    if (!id && !name) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const query: QueryOptions = {};

    if (id) {
      query["_id"] = getObjectId(id);
    }

    if (name) {
      query["name"] = name;
    }

    return CardModel.findOneAndDelete(query).lean();
  }
}
