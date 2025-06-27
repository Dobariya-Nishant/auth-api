import { inject, injectable } from "tsyringe";
import { Session } from "@/domain/entities/session.enttity";
import { ISessionService } from "@/domain/interface/service/session.service.interface";
import { ISessionRepository } from "@/domain/interface/repositories/session.repository.interface";
import {
  MultiSessionQuery,
  SessionQuery,
} from "@/domain/interface/types/session.types";
import { NotFoundError, UnauthorizedError } from "@/domain/errors/app-errors";
import { User } from "@/domain/entities/user.entity";
import { Tokens } from "@/domain/interface/types/crypto.types";
import { ICryptoService } from "@/domain/interface/service/crypto.service.interface";
import { getNewObjectId } from "@/domain/helpers/objectId";

@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject("SessionRepository")
    private sessionRepository: ISessionRepository,
    @inject("UserRepository")
    private cryptoService: ICryptoService
  ) {}

  get(query: MultiSessionQuery): Promise<Session[]> {
    query.limit = 20;
    return this.sessionRepository.get(query);
  }

  async getOne(query: SessionQuery): Promise<Session> {
    const session = await this.sessionRepository.getOne(query);

    if (!session) {
      throw new NotFoundError("Session Not Found or Expired!!");
    }

    return session;
  }

  async create(user: User): Promise<Tokens> {
    const tokens = this.cryptoService.generateSessionTokens(user._id);

    const session: Session = {
      //@ts-ignore
      _id: getNewObjectId(),
      userId: user._id,
      token: tokens.refreshtoken,
    };

    await this.sessionRepository.create(session);

    return tokens;
  }

  async refresh(query: SessionQuery): Promise<Tokens> {
    const tokens = this.cryptoService.generateSessionTokens(query.userId);

    const session = await this.sessionRepository.refresh(
      query,
      tokens.refreshtoken
    );

    if (!session) {
      throw new UnauthorizedError("Session not Found!");
    }

    return tokens;
  }

  async delete(query: SessionQuery): Promise<void> {
    await this.sessionRepository.delete(query);
  }
}
