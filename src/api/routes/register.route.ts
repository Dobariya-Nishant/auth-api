import { FastifyInstance } from "fastify";
import authRouter from "./auth.route";
import { cardRouter } from "./card.route";

type FastifyRoute = (fastify: FastifyInstance) => Promise<void>;

export function registerRoutes(app: FastifyInstance) {
  const routes: { prefix: string; route: FastifyRoute }[] = [
    {
      prefix: "/auth",
      route: authRouter,
    },
    { prefix: "/card", route: cardRouter },
  ];

  for (const routeObj of routes) {
    app.register(routeObj.route, { prefix: `/v1${routeObj.prefix}` });
  }
}
