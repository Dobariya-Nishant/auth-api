import { injectable } from "tsyringe";
import { QueryOptions } from "mongoose";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { userError } from "@/domain/messages/error/user.error";
import { getObjectId } from "@/domain/helpers/objectId";
import {
  MultiSessionQuery,
  SessionQuery,
} from "@/domain/interface/types/session.types";
import { ISessionRepository } from "@/domain/interface/repositories/session.repository.interface";
import { SessionModel } from "@/infrastructure/db/mongodb/models/session.model";
import { Session } from "@/domain/entities/session.enttity";

@injectable()
export class SessionRepository implements ISessionRepository {
  get({ limit = 0, userId, lastId }: MultiSessionQuery): Promise<Session[]> {
    const query: QueryOptions = {};

    if (userId) {
      query["userId"] = getObjectId(userId);
    }

    if (lastId) {
      query["_id"] = { $lt: getObjectId(lastId) };
    }

    return SessionModel.find(query).limit(limit).sort({ createdAt: -1 }).lean();
  }

  async getOne({ userId, token }: SessionQuery): Promise<Session | null> {
    if (!userId || !token) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const userObjectId = getObjectId(userId);

    const query: QueryOptions = {
      _id: userObjectId,
      token: token,
    };

    return SessionModel.findOne(query).lean();
  }

  create(session: Session): Promise<Session> {
    return SessionModel.create(session);
  }

  refresh(query: SessionQuery, token: string): Promise<Session | null> {
    if (!query.userId || !query.token || !token) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }
    //@ts-ignore
    query.userId = getObjectId(query.userId);

    const update: QueryOptions = {
      token: token,
    };

    return SessionModel.findOneAndUpdate(query, update).lean();
  }

  delete({ userId, token }: SessionQuery): Promise<Session | null> {
    if (!userId || !token) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const userObjectId = getObjectId(userId);

    const query: QueryOptions = {
      _id: userObjectId,
      token: token,
    };

    return SessionModel.findOneAndDelete(query).lean();
  }
}
