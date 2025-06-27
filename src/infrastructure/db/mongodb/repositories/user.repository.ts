import { injectable } from "tsyringe";
import { QueryOptions } from "mongoose";
import { User } from "@/domain/entities/user.entity";
import { IUserRepository } from "@/domain/interface/repositories/user.repository.interface";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { userError } from "@/domain/messages/error/user.error";
import { UserModel } from "@/infrastructure/db/mongodb/models/user.model";
import { getObjectId, getObjectIds } from "@/domain/helpers/objectId";
import { userProjection } from "@/infrastructure/db/mongodb/repositories/projections/user.projection";

@injectable()
export class UserRepository implements IUserRepository {
  get({ limit = 0, lastId, userIds }: MultiUserQuery): Promise<User[]> {
    const query: QueryOptions = {
      _id: {},
    };

    if (userIds?.length) {
      const userObjectIds = getObjectIds(userIds);
      query._id["$in"] = userObjectIds;
    }

    if (lastId) {
      const userObjectId = getObjectId(lastId);
      query._id["$lt"] = userObjectId;
    }

    return UserModel.find(query, userProjection)
      .limit(limit || userIds.length)
      .sort({ createdAt: -1 })
      .lean();
  }

  getOne({ email, userId, userName }: UserQuery): Promise<User | null> {
    if (!userId && !email && !userName) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const query: QueryOptions = {};

    if (userId) {
      const userObjectId = getObjectId(userId);
      query["_id"] = userObjectId;
    }
    if (email) {
      query["email"] = email;
    }
    if (userName) {
      query["userName"] = userName;
    }

    return UserModel.findOne(query, userProjection).lean();
  }

  create(user: User): Promise<User> {
    return UserModel.create(user);
  }

  update(userId: string, updateUser: Partial<User>): Promise<User | null> {
    const userObjectId = getObjectId(userId);

    return UserModel.findOneAndUpdate({ _id: userObjectId }, updateUser, {
      new: true,
      projection: userProjection,
    }).lean();
  }

  delete({ userId, email, userName }: UserQuery): Promise<User | null> {
    if (!userId && !email && !userName) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const query: QueryOptions = {};

    if (email) {
      query["email"] = email;
    }
    if (userId) {
      query["_id"] = getObjectId(userId);
    }
    if (userName) {
      query["userName"] = userName;
    }

    return UserModel.findOneAndDelete(query, {
      projection: userProjection,
    }).lean();
  }
}
