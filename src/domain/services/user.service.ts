import { inject, injectable } from "tsyringe";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { AuthTypeEnum } from "@/domain/enum/user.enum";
import { User } from "@/domain/entities/user.entity";
import { userError } from "@/domain/messages/error/user.error";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import { IUserRepository } from "@/domain/interface/repositories/user.repository.interface";
import { ICryptoService } from "@/domain/interface/service/crypto.service.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("UserRepository")
    private cryptoService: ICryptoService
  ) {}

  get({ userIds, lastId }: MultiUserQuery): Promise<User[]> {
    const limit = 20;
    return this.userRepository.get({
      limit,
      lastId,
      userIds,
    });
  }

  async getOne(query: UserQuery): Promise<User> {
    const user = await this.userRepository.getOne(query);

    if (!user) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    return user;
  }

  async create(user: User): Promise<User> {
    const isExist = await this.isUser({
      email: user.email,
      userName: user.userName,
    });

    if (isExist) {
      throw new ConflictError(userError.ALREADY_EXIST);
    }

    if (user.authType === AuthTypeEnum.LOCAL) {
      if (!user.password) {
        throw new UnprocessableEntityError(userError.PASSWORD_REQURED);
      }

      const hashedPassword = await this.cryptoService.hashPassword(
        user.password
      );

      user.password = hashedPassword;
    }

    const newUser = await this.userRepository.create(user);

    return newUser;
  }

  async update(userId: string, userUpdate: Partial<User>): Promise<User> {
    const updatedUser = await this.userRepository.update(userId, userUpdate);

    if (!updatedUser) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    return updatedUser;
  }

  async delete(query: UserQuery): Promise<User> {
    const deletedUser = await this.userRepository.delete(query);

    if (!deletedUser) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    return deletedUser;
  }

  async isUser(query: UserQuery): Promise<Boolean> {
    const user = await this.getOne(query);

    if (user) {
      return true;
    }

    return false;
  }
}
