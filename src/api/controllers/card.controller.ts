import { Card } from "@/domain/entities/card.entity";
import { RoleTypeEnum } from "@/domain/enum/user.enum";
import ICardService from "@/domain/interface/service/card.service.interface";
import { CardQuery, MultiCardQuery } from "@/domain/interface/types/card.types";
import { userSuccess } from "@/domain/messages/success/user.message";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";

@injectable()
export default class CardController {
  constructor(@inject("CardService") private cardService: ICardService) {}

  async get(request: FastifyRequest, reply: FastifyReply) {
    //@ts-ignore
    const user = request.user;
    const queryObj = request.query as MultiCardQuery;

    const query: MultiCardQuery = {
      userId: user._id,
      lastId: queryObj.lastId,
      category: queryObj.category,
    };

    const cards = await this.cardService.get(query);

    return reply.send({
      statusCode: 201,
      data: cards,
      message: userSuccess.SIGN_UP,
    });
  }

  async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as CardQuery;

    const query: CardQuery = {
      id: id,
    };

    const cards = await this.cardService.getOne(query);

    return reply.send({
      statusCode: 201,
      data: cards,
      message: userSuccess.SIGN_UP,
    });
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    //@ts-ignore
    const user = request.user;
    const body = request.body as Card;

    const card: Card = {
      //@ts-ignore
      _id: getNewObjectId(),
      name: body.name,
      role: RoleTypeEnum.USER,
      cardsDetails: body.cardsDetails,
      ...(body.isPhotoSupport && { isPhotoSupport: body.isPhotoSupport }),
      ...(body.templateId && { templateId: body.templateId }),
      ...(user._id && { userId: user._id }),
      ...(body.orientation && { orientation: body.orientation }),
      ...(body.isPremium && { isPremium: body.isPremium }),
      ...(body.isCustom && { isCustom: body.isCustom }),
      ...(body.tags && { tags: body.tags }),
      ...(body.price && { price: body.price }),
      ...(body.categories && { categories: body.categories }),
    };

    const newCard = await this.cardService.create(card);

    return reply.send({
      statusCode: 201,
      data: newCard,
      message: userSuccess.SIGN_UP,
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Card;

    //@ts-ignore
    const cardUpdate: Partial<Card> = {
      ...(body.name && { name: body.name }),
      ...(body.isPhotoSupport && { isPhotoSupport: body.isPhotoSupport }),
      ...(body.templateId && { templateId: body.templateId }),
      ...(body.orientation && { orientation: body.orientation }),
      ...(body.isPremium && { isPremium: body.isPremium }),
      ...(body.isCustom && { isCustom: body.isCustom }),
      ...(body.tags && { tags: body.tags }),
      ...(body.price && { price: body.price }),
      ...(body.categories && { categories: body.categories }),
      cardsDetails: body.cardsDetails,
    };

    //@ts-ignore
    const cardUpdate = await this.cardService.update(body.cardId, cardUpdate);

    return reply.send({
      statusCode: 200,
      data: cardUpdate,
      message: userSuccess.SIGN_UP,
    });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as CardQuery;

    const query: CardQuery = {
      ...(body.id && { cardId: body.id }),
      ...(body.name && { name: body.name }),
    };

    const cardUpdate = await this.cardService.delete(query);

    return reply.send({
      statusCode: 200,
      data: cardUpdate,
      message: userSuccess.SIGN_UP,
    });
  }
}
