import { JwtPayload } from "@/domain/entities/jwt.entity";

export interface ICryptoService {
  generateSessionTokens(userId: string): {
    accesstoken: string;
    refreshtoken: string;
  };

  verifySessionToken(token: string, isRefresh: boolean): JwtPayload;

  hashPassword(password: string): Promise<string>;

  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}
