import { User } from "@/domain/entities/user.entity";

export interface IUserService {
  get(query: MultiUserQuery): Promise<User[]>;

  getOne(query: UserQuery): Promise<User | null>;

  create(user: User, profilePicture?: any): Promise<User>;

  update(
    userId: string,
    user: Partial<User>,
    profilePicture?: any
  ): Promise<User>;

  delete(query: UserQuery): Promise<User>;

  isUser(query: UserQuery): Promise<Boolean>;
}
