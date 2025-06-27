import { Tokens } from "../types/crypto.types";

export interface IAuthService {
  login(email: string, password: string): Promise<Tokens>;

  logout(userId: string, token: string): Promise<void>;
}
