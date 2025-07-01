import { User } from "@/domain/entities/user.entity";
import { RoleTypeEnum } from "@/domain/enum/user.enum";
import { ICryptoService } from "@/domain/interface/service/crypto.service.interface";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import { userError } from "@/domain/messages/error/user.error";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";

@injectable()
export default class Middleware {
  publicRoutes = [];

  constructor(
    @inject("CryptoService")
    private cryptoService: ICryptoService,
    @inject("UserService")
    private userService: IUserService
  ) {}

  async checkApiKey(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const clientKey = request.headers["x-api-key"];
    //@ts-ignore
    if (!clientKey || clientKey !== request?.server?.config?.X_API_KEY) {
      reply.code(401).send({ message: "Invalid or missing API Key 🛑" });
    }
  }

  async auth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const url = request.url.split("?")[0];
    //@ts-ignore
    if (this.publicRoutes.includes(url)) return;

    const token = request.headers["authorization"];

    if (!token) {
      return reply.code(401).send({ message: userError.UN_AUTHORIZED });
    }
    //@ts-ignore
    const data = this.cryptoService.verifySessionToken(token);

    if (!data) {
      return reply.code(401).send({ message: userError.UN_AUTHORIZED });
    }

    const user = await this.userService.getOne({ userId: data.userId });

    if (!user) {
      return reply.code(401).send({ message: userError.UN_AUTHORIZED });
    }

    //@ts-ignore
    request["user"] = user;
  }

  adminAccess(request: FastifyRequest, reply: FastifyReply): void {
    //@ts-ignore
    const user = request.user as User;

    if (user.role != RoleTypeEnum.ADMIN) {
      reply.code(403).send({ message: userError.FORBIDDEN });
      return;
    }
  }
}
