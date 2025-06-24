import { inject, injectable } from "tsyringe";
import { Session } from "@/domain/entities/session.enttity";
import { ISessionService } from "@/domain/interface/service/session.service.interface";
import { ISessionRepository } from "@/domain/interface/repositories/session.repository.interface";
import { User } from "@/domain/entities/user.entity";
import { getNewObjectId } from "@/domain/helpers/objectId";
import { ICryptoService } from "@/domain/interface/service/crypto.service.interface";
import { Tokens } from "@/domain/interface/types/crypto.types";

@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject("SessionRepository")
    private sessionRepository: ISessionRepository,
    @inject("CryptoService")
    private cryptoService: ICryptoService
  ) {}

  get({
    userId,
    createdAt,
  }: {
    userId: string;
    createdAt?: Date;
  }): Promise<Session[]> {
    const limit = 20;
    return this.sessionRepository.get({
      limit,
      createdAt,
      userId,
    });
  }

  async getOne({
    userId,
    token,
  }: {
    userId: string;
    token: string;
  }): Promise<Session> {
    return this.sessionRepository.getOne({ token, userId });
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

  delete({
    userId,
    token,
  }: {
    token: string;
    userId: string;
  }): Promise<Session> {
    return this.sessionRepository.delete({ userId, token });
  }
}
