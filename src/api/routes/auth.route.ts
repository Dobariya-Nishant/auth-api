import { FastifyInstance } from "fastify";
import container from "dependency/container";
import AuthController from "@/api/controllers/auth.controller";

export default async function authRouter(app: FastifyInstance) {
  const authController = container.resolve<AuthController>("AuthController");

  app.route({
    method: "POST",
    url: "/sig-up",
    schema: {
      body: {
        type: "object",
        properties: {
          userName: { type: "string" },
          password: { type: "string" },
          email: { type: "string" },
          profilePicture: { type: "string" },
          bio: { type: "string" },
          phoneNumber: { type: "string" },
          address: { type: "string" },
        },
        required: ["email", "password"],
      },
    },
    handler: authController.signUp.bind(authController),
  });

  app.route({
    method: "POST",
    url: "/login",
    schema: {
      body: {
        type: "object",
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
        required: ["email", "password"],
      },
    },
    handler: authController.login.bind(authController),
  });

  app.route({
    method: "POST",
    url: "/logout",
    handler: authController.logout.bind(authController),
  });
}
