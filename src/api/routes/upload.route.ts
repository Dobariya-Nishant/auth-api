import { FastifyInstance } from "fastify";
import cardRouter from "@/api/routes/card.route";
import authRouter from "@/api/routes/auth.route";

type FastifyRoute = (fastify: FastifyInstance) => Promise<void>;

export function uploadRoutes(app: FastifyInstance) {
  const routes: { prefix: string; route: FastifyRoute }[] = [
    {
      prefix: "/auth",
      route: authRouter,
    },
    { prefix: "/card", route: cardRouter },
  ];

  for (const routeObj of routes) {
    app.register(routeObj.route, { prefix: `${routeObj.prefix}` });
  }
}
