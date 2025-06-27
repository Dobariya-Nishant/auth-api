import { MultiSessionQuery, SessionQuery } from "../types/session.types";
import { Session } from "@/domain/entities/session.enttity";

export interface ISessionRepository {
  get(query: MultiSessionQuery): Promise<Session[]>;

  getOne(query: SessionQuery): Promise<Session | null>;

  create(user: Session): Promise<Session>;

  refresh(query: SessionQuery, token: string): Promise<Session | null>;

  delete(query: SessionQuery): Promise<Session | null>;
}
