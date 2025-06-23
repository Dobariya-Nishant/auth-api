import { FastifyInstance } from "fastify";

export async function userRouter(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
        required: ["name"],
      },
    },
    handler: async (request, reply) => {
      return { hello: "world" };
    },
  });
}
