import { User } from "@/domain/entities/user.entity";
import { Tokens } from "@/domain/interface/types/crypto.types";

export interface IAuthService {
  login(email: string, password: string): Promise<Tokens>;

  signUp(user: User): Promise<Tokens>;

  refresh(userId: string, refreshToken: string): Promise<Tokens>;

  logout(userId: string, token: string): Promise<void>;
}
