import { IUserService } from "@/domain/interface/service/user.service.interface";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";

@injectable()
export default class UserController {
  constructor(@inject("UserService") private userService: IUserService) {}

  get(request: FastifyRequest, reply: FastifyReply) {}

  getOne(request: FastifyRequest, reply: FastifyReply) {}

  delete(request: FastifyRequest, reply: FastifyReply) {}
}
