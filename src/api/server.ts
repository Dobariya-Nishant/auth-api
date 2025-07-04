import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import fastifyMultipart from "@fastify/multipart";
import ratelimiter from "@fastify/rate-limit";
import ratelimitConfig from "@/api/config/ratelimit";
import fastifyCookie from "@fastify/cookie";
import Middleware from "@/api/middlewares/middleware";
import { envSchema } from "@/api/config/env";
import { registerRoutes } from "@/api/routes/register.route";
import { dbConnect } from "@/infrastructure/db/mongodb/client";
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

  await app.register(fastifyEnv, envSchema);

  env = app.getEnvs();

  await app.register(ratelimiter, ratelimitConfig);

  await app.register(fastifyMultipart, { attachFieldsToBody: "keyValues" });

  await app.register(fastifyCookie, {
    secret: env.COOKIE_KEY,
  });

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

  registerRoutes(app);

  try {
    await dbConnect();
    await app.listen({ port: env.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
