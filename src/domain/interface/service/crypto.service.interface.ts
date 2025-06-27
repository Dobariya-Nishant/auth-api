import { JwtPayload } from "@/domain/entities/jwt.entity";
import { Tokens } from "@/domain/interface/types/crypto.types";

export interface ICryptoService {
  generateSessionTokens(userId: string): Tokens;

  verifySessionToken(token: string, isRefresh: boolean): JwtPayload;

  hashPassword(password: string): Promise<string>;

  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}
