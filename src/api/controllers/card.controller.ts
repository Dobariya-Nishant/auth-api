import { User } from "@/domain/entities/user.entity";
import { AuthTypeEnum } from "@/domain/enum/user.enum";
import { getNewObjectId } from "@/domain/helpers/objectId";
import ICardService from "@/domain/interface/service/card.service.interface";
import { userSuccess } from "@/domain/messages/success/user.message";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";

@injectable()
export default class CardController {
  constructor(@inject("CardService") private cardService: ICardService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
   
    const tokens = await this.cardService.signUp(user);

    reply.send({
      statusCode: 201,
      data: tokens,
      message: userSuccess.SIGN_UP,
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body;
    //@ts-ignore
    const tokens = await this.cardService.login(body.email, body.password);

    reply.send({
      statusCode: 201,
      data: tokens,
      message: userSuccess.SIGN_UP,
    });
  }

  logout(request: FastifyRequest, reply: FastifyReply) {}
}
