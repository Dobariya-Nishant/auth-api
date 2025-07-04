import { userSuccess } from "@/domain/messages/success/user.message";
import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "tsyringe";

@injectable()
export default class UploadController {
  //   constructor(@inject("StorageServce") private storageServce:) {}

  async card(request: FastifyRequest, reply: FastifyReply) {
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === "file") {
      }
    }

    return reply.code(201).send({
      statusCode: 201,
      //   data: { accesstoken: tokens.accesstoken },
      message: userSuccess.SIGN_UP,
    });
  }
}
