import { FastifyInstance } from "fastify";

export async function cardRouter(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/card",
    // schema: {
    //   querystring: {
    //     type: "object",
    //     properties: {
    //       name: { type: "string" },
    //     },
    //     required: ["name"],
    //   },
    // },
    handler: async (request, reply) => {
      return { hello: "world" };
    },
  });
}
