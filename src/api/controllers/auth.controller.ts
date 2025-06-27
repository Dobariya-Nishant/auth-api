import { IAuthService } from "@/domain/interface/service/auth.service.interface";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";

@injectable()
export default class AuthController {
  constructor(@inject("AuthService") private authService: IAuthService) {}

  signUp(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body;
  }

  login(request: FastifyRequest, reply: FastifyReply) {}

  logout(request: FastifyRequest, reply: FastifyReply) {}
}
