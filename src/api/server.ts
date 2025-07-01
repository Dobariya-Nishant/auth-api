import fastifyMultipart from "@fastify/multipart";
import Fastify from "fastify";
import ratelimiter from "@fastify/rate-limit";
import ratelimitConfig from "@/api/config/ratelimit";
import fastifyEnv from "@fastify/env";
import { envSchema } from "@/api/config/env";
import { registerRoutes } from "@/api/routes/register.route";
import { dbConnect } from "@/infrastructure/db/mongodb/client";
import Middleware from "./middlewares/middleware";
import { container } from "tsyringe";

export let env: any;

export async function server() {
  const middleware = container.resolve<Middleware>("Middleware");
  const app = Fastify({
    logger: {
      transport: {
        target: "@fastify/one-line-logger",
      },
      customLevels: {
        foo: 35,
        bar: 45,
      },
    },
  });

  await app.register(fastifyMultipart, { attachFieldsToBody: "keyValues" });

  await app.register(fastifyEnv, envSchema);

  await app.register(ratelimiter, ratelimitConfig);

  app.addHook("onRequest", middleware.checkApiKey.bind(middleware));

  app.addHook("onRequest", middleware.auth.bind(middleware));

  app.setNotFoundHandler(
    {
      preHandler: app.rateLimit(),
    },
    function (request, reply) {
      reply.code(404).send({
        statusCode: 404,
        error: "Not Found",
        message: `Route ${request.method} ${request.url} not found!!`,
      });
    }
  );

  env = app.getEnvs();

  registerRoutes(app);

  try {
    await dbConnect();
    await app.listen({ port: env.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
