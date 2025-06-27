import { User } from "@/domain/entities/user.entity";

export interface IUserRepository {
  get(query: MultiUserQuery): Promise<User[]>;

  getOne(query: UserQuery): Promise<User | null>;

  create(user: User): Promise<User>;

  update(userId: string, updateUser: Partial<User>): Promise<User | null>;

  delete(query: UserQuery): Promise<User | null>;
}
