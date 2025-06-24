import { Session } from "@/domain/entities/session.enttity";
import { User } from "@/domain/entities/user.entity";
import { Tokens } from "@/domain/interface/types/crypto.types";

export interface ISessionService {
  get({ userId }: { userId: string }): Promise<Session[]>;

  getOne({
    userId,
    token,
  }: {
    userId?: string;
    token?: string;
  }): Promise<Session>;

  create(user: User): Promise<Tokens>;

  delete({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }): Promise<Session>;
}
