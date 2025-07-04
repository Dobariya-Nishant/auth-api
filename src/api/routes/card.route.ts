import { FastifyInstance } from "fastify";
import container from "dependency/container";
import CardController from "@/api/controllers/card.controller";

export default async function cardRouter(app: FastifyInstance) {
  const cardController = container.resolve<CardController>("CardController");

  app.route({
    method: "GET",
    url: "/:id",
    handler: cardController.getOne.bind(cardController),
  });

  app.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: {
        type: "object",
        properties: {
          userId: { type: "string" },
          lastId: { type: "string" },
          category: { type: "string" },
        },
      },
    },
    handler: cardController.get.bind(cardController),
  });

  app.route({
    method: "POST",
    url: "/",
    schema: {
      body: {
        type: "object",
        properties: {
          userName: { type: "string" },
          password: { type: "string" },
          email: { type: "string" },
          profilePicture: { type: "string" },
          bio: { type: "string" },
          phoneNumber: { type: "string" },
          address: { type: "string" },
        },
        required: ["email", "password"],
      },
    },
    handler: cardController.create.bind(cardController),
  });

  app.route({
    method: "PATCH",
    url: "/",
    schema: {
      body: {
        type: "object",
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
        required: ["email", "password"],
      },
    },
    handler: cardController.update.bind(cardController),
  });
}
