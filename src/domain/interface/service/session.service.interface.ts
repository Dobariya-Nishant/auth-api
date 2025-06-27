import { Session } from "@/domain/entities/session.enttity";
import { User } from "@/domain/entities/user.entity";
import {
  MultiSessionQuery,
  SessionQuery,
} from "@/domain/interface/types/session.types";
import { Tokens } from "@/domain/interface/types/crypto.types";

export interface ISessionService {
  get(query: MultiSessionQuery): Promise<Session[]>;

  getOne(query: SessionQuery): Promise<Session>;

  create(user: User): Promise<Tokens>;

  refresh(query: SessionQuery): Promise<Tokens>;

  delete(query: SessionQuery): Promise<void>;
}
