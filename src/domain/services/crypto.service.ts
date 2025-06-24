import { env } from "@/api/server";
import { sign, verify } from "jsonwebtoken";
import { JwtPayload } from "@/domain/entities/jwt.entity";
import { hash, compare } from "bcrypt";
import { injectable } from "tsyringe";

@injectable()
export class CryptoService {
  constructor() {}

  generateSessionTokens(userId: string) {
    const accesstoken = sign({ userId }, env.PRIVATE_ACCESS_TOKEN_KEY, {
      expiresIn: "1d",
      algorithm: "RS256",
    });

    const refreshtoken = sign({ userId }, env.PRIVATE_REFRESH_TOKEN_KEY, {
      expiresIn: "7d",
      algorithm: "RS256",
    });

    return { accesstoken, refreshtoken };
  }

  verifySessionToken(token: string, isRefresh: boolean) {
    let key: string;

    if (isRefresh) {
      key = env.PUBLIC_REFRESH_TOKEN_KEY;
    } else {
      key = env.PUBLIC_ACCESS_TOKEN_KEY;
    }

    const payload = verify(token, key, {
      algorithms: ["RS256"],
    });

    return payload as JwtPayload;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashed = await hash(password, saltRounds);
    return hashed;
  }

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const match = await compare(password, hashedPassword);
    return match;
  }
}
