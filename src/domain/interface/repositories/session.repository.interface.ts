import { Session } from "@/domain/entities/session.enttity";

export interface ISessionRepository {
  get({
    limit,
    createdAt,
    userId,
  }: {
    limit?: number;
    createdAt?: Date;
    userId: string;
  }): Promise<Session[]>;

  getOne({
    userId,
    token,
  }: {
    userId?: string;
    token?: string;
  }): Promise<Session>;

  create(session: Session): Promise<Session>;

  delete({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }): Promise<Session>;
}
