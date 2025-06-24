import { inject, injectable } from "tsyringe";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { AuthTypeEnum } from "@/domain/enum/user.enum";
import { User } from "@/domain/entities/user.entity";
import { userError } from "@/domain/messages/error/user.error";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import { IUserRepository } from "@/domain/interface/repositories/user.repository.interface";
import { ICryptoService } from "@/domain/interface/service/crypto.service.interface";
import { ISessionService } from "@/domain/interface/service/session.service.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("UserRepository")
    private cryptoService: ICryptoService,
    @inject("UserRepository")
    private sessionService: ISessionService
  ) {}
  oAuthSignUpOrLogin(user: User): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  get({
    userIds,
    excludeUserIds,
    createdAt,
  }: {
    userIds?: Array<string>;
    excludeUserIds?: Array<string>;
    createdAt?: Date;
  }): Promise<User[]> {
    const limit = 20;
    return this.userRepository.get({
      limit,
      createdAt,
      userIds,
      excludeUserIds,
    });
  }

  async getOne({
    email,
    userId,
    userName,
  }: {
    email?: string;
    userId?: string;
    userName?: string;
  }): Promise<User> {
    const user = await this.userRepository.getOne({ email, userId, userName });

    if (!user) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    return user;
  }

  async create(user: User): Promise<User> {
    const isExist = await this.isUser(user.email, user.userName);

    if (isExist) {
      throw new ConflictError(userError.ALREADY_EXIST);
    }

    if (user.authType === AuthTypeEnum.LOCAL) {
      if (!user.password) {
        throw new UnprocessableEntityError(userError.PASSWORD_REQURED);
      }

      const hashedPassword = await this.cryptoService.hashPassword(user.password);

      // if (user.profilePicture) {
      //   const [profileUrl] = await this.storageRepository.uploadFiles(
      //     user._id,
      //     [user.profilePicture]
      //   );
      //   user.profilePicture = profileUrl.url;
      // }

      user.password = hashedPassword;
    }

    const newUser = await this.userRepository.create(user);

    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.getOne({ email });

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

    const userWithSession = await this.sessionService.(user);

    return userWithSession;
  }

  async update(
    userId: string,
    userUpdate: Partial<User>,
    profilePicture: any
  ): Promise<User> {
    const user = await this.getOne({ userId });

    if (profilePicture) {
      if (user?.profilePicture && isS3Url(user?.profilePicture)) {
        await this.storageRepository.deleteFiles([user.profilePicture]);
      }
      if (!isValidUrl(profilePicture)) {
        const [profileUrl] = await this.storageRepository.uploadFiles(
          user._id,
          [user.profilePicture]
        );
        user.profilePicture = profileUrl.url;
      }
      userUpdate.profilePicture = profilePicture;
    }

    return this.userRepository.update(userId, userUpdate);
  }

  delete({
    email,
    userId,
  }: {
    email?: string;
    userId?: string;
  }): Promise<User> {
    return this.userRepository.delete({ email, userId });
  }

  isUser(email: string, userName?: string): Promise<Boolean> {
    return this.userRepository.checkUserExist(email, userName);
  }
}
