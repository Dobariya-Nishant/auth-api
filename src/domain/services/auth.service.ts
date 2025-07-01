import { inject, injectable } from "tsyringe";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/domain/errors/app-errors";
import { userError } from "@/domain/messages/error/user.error";
import { AuthTypeEnum } from "@/domain/enum/user.enum";
import { ICryptoService } from "@/domain/interface/service/crypto.service.interface";
import { ISessionService } from "@/domain/interface/service/session.service.interface";
import { Tokens } from "@/domain/interface/types/crypto.types";
import { IAuthService } from "@/domain/interface/service/auth.service.interface";
import { User } from "@/domain/entities/user.entity";

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject("UserService")
    private userService: IUserService,
    @inject("CryptoService")
    private cryptoService: ICryptoService,
    @inject("SessionService")
    private sessionService: ISessionService
  ) {}

  async login(email: string, password: string): Promise<Tokens> {
    const user = await this.userService.getOne({ email });

    if (!user?._id) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    if (user.authType == AuthTypeEnum.GOOGLE || !user?.password) {
      throw new NotFoundError(userError.LOGIN_GOOGLE);
    }

    const isValidPassword = await this.cryptoService.verifyPassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError(userError.INVALID_CREDENCIAL);
    }

    const tokens = await this.sessionService.create(user);

    return tokens;
  }

  async signUp(user: User): Promise<Tokens> {
    const newUser = await this.userService.create(user);

    const tokens = await this.sessionService.create(newUser);

    return tokens;
  }

  async refresh(userId: string, refreshToken: string): Promise<Tokens> {
    const tokenObj = await this.sessionService.getOne({
      userId: userId,
      token: refreshToken,
    });

    if (!tokenObj) {
      throw new UnauthorizedError(userError.UN_AUTHORIZED);
    }

    const isTokenValid = this.cryptoService.verifySessionToken(
      tokenObj.token,
      true
    );

    if (!isTokenValid) {
      throw new UnauthorizedError(userError.UN_AUTHORIZED);
    }

    const tokens = await this.sessionService.refresh({
      userId: userId,
      token: refreshToken,
    });

    return tokens;
  }

  async logout(userId: string, token: string): Promise<void> {
    await this.sessionService.delete({ userId, token });
  }
}
