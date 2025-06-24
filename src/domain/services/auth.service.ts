import { inject, injectable } from "tsyringe";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import { NotFoundError, UnauthorizedError } from "../errors/app-errors";
import { userError } from "../messages/error/user.error";
import { AuthTypeEnum } from "../enum/user.enum";
import { ICryptoService } from "@/domain/interface/service/crypto.service.interface";
import { ISessionService } from "@/domain/interface/service/session.service.interface";
import { Tokens } from "@/domain/interface/types/crypto.types";

@injectable()
export class AuthService {
  constructor(
    @inject("UserService")
    private userService: IUserService,
    @inject("UserRepository")
    private cryptoService: ICryptoService,
    @inject("UserRepository")
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

    const isValidPassword = this.cryptoService.verifyPassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError(userError.INVALID_CREDENCIAL);
    }

    const tokens = await this.sessionService.create(user);

    return tokens;
  }

  async logout(userId: string, token: string): Promise<void> {
    await this.sessionService.delete({ userId, token });
  }
}
