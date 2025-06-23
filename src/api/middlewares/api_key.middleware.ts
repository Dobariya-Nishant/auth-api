import { FastifyRequest, FastifyReply } from "fastify";

export default async function checkApiKey(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const clientKey = request.headers["x-api-key"];
  //@ts-ignore
  if (!clientKey || clientKey !== request?.server?.config?.X_API_KEY) {
    reply.code(401).send({ message: "Invalid or missing API Key 🛑" });
  }
}
