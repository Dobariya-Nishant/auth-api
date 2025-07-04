import { User } from "@/domain/entities/user.entity";
import { AuthTypeEnum } from "@/domain/enum/user.enum";
import { getNewObjectId } from "@/domain/helpers/objectId";
import { IAuthService } from "@/domain/interface/service/auth.service.interface";
import { userSuccess } from "@/domain/messages/success/user.message";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";

@injectable()
export default class AuthController {
  constructor(@inject("AuthService") private authService: IAuthService) {}

  async signUp(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as User;

    const user: User = {
      //@ts-ignore
      _id: getNewObjectId(),
      userName: body.userName,
      email: body.email,
      password: body.password,
      authType: AuthTypeEnum.LOCAL,
      profilePicture: body.profilePicture,
      bio: body.bio,
      phoneNumber: body.phoneNumber,
      address: body.address,
    };

    const tokens = await this.authService.signUp(user);

    reply.setCookie("refreshtoken", tokens.refreshtoken, {
      path: "/auth",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      signed: true,
    });

    return reply.code(201).send({
      statusCode: 201,
      data: { accesstoken: tokens.accesstoken },
      message: userSuccess.SIGN_UP,
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body;
    //@ts-ignore
    const tokens = await this.authService.login(body.email, body.password);

    reply.setCookie("refreshtoken", tokens.refreshtoken, {
      path: "/auth",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      signed: true,
    });

    return reply.code(200).send({
      statusCode: 200,
      data: { accesstoken: tokens.accesstoken },
      message: userSuccess.SIGN_UP,
    });
  }

  logout(request: FastifyRequest, reply: FastifyReply) {
    const token = request?.headers;
    //@ts-ignore
    const userId = request?.user?._id;
    //@ts-ignore
    const tokens = await this.authService.logout(userId, token);

    reply.clearCookie("refreshtoken", {
      path: "/auth",
    });

    return reply.code(200).send({
      statusCode: 200,
      data: tokens,
      message: userSuccess.SIGN_UP,
    });
  }

  refresh(request: FastifyRequest, reply: FastifyReply) {
    //@ts-ignore
    const refreshtoken = request.unsignCookie(request?.cookies?.refreshtoken);
    //@ts-ignore
    const userId = request?.user?._id;
    //@ts-ignore
    const tokens = await this.authService.refresh(userId, refreshtoken);

    reply.setCookie("refreshtoken", tokens.refreshtoken, {
      path: "/auth",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      signed: true,
    });

    return reply.code(200).send({
      statusCode: 200,
      data: { accesstoken: tokens.accesstoken },
      message: userSuccess.SIGN_UP,
    });
  }
}
