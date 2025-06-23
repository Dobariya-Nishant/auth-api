import { User } from "@/domain/entities/user.entity";

export interface IUserRepository {
  get({
    limit,
    createdAt,
    userIds,
    excludeUserIds,
  }: {
    limit: number;
    createdAt?: Date;
    userIds?: Array<string>;
    excludeUserIds?: Array<string>;
  }): Promise<User[]>;

  getOne({
    email,
    userId,
    userName,
  }: {
    email?: string;
    userId?: string;
    userName?: string;
  }): Promise<User | null>;

  create(user: User): Promise<User>;

  update(userId: string, updateUser: Partial<User>): Promise<User>;

  delete({ userId, email }: { userId?: string; email?: string }): Promise<User>;
}
