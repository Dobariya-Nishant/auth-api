import fastifyMultipart from "@fastify/multipart";
import Fastify from "fastify";
import ratelimiter from "@fastify/rate-limit";
import ratelimitConfig from "./config/ratelimit";
import fastifyEnv from "@fastify/env";
import { envSchema } from "./config/env";
import checkApiKey from "./middlewares/api_key.middleware";
import { registerRoutes } from "./routes/register.route";

export let env: any;

export async function server() {
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

  await app.register(ratelimiter, ratelimitConfig);

  await app.register(fastifyMultipart);

  app.addHook("onRequest", checkApiKey);

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
    //@ts-ignore
    await app.listen({ port: app.config.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
