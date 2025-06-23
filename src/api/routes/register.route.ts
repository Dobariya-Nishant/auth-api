import { FastifyInstance } from "fastify";
import { userRouter } from "./user.route";
import { cardRouter } from "./card.route";

type FastifyRoute = (fastify: FastifyInstance) => Promise<void>;

export function registerRoutes(app: FastifyInstance) {
  const routes: FastifyRoute[] = [userRouter, cardRouter];

  for (const route of routes) {
    app.register(route, { prefix: "/v1" });
  }
}
