import "reflect-metadata";
import AuthController from "@/api/controllers/auth.controller";
import UserController from "@/api/controllers/user.controller";
import UserService from "@/domain/services/user.service";
import SessionService from "@/domain/services/session.service";
import AuthService from "@/domain/services/auth.service";
import CryptoService from "@/domain/services/crypto.service";
import UserRepository from "@/infrastructure/db/mongodb/repositories/user.repository";
import SessionRepository from "@/infrastructure/db/mongodb/repositories/session.repository";
import { container } from "tsyringe";
import Middleware from "@/api/middlewares/middleware";
import CardService from "@/domain/services/card.service";
import CardRepository from "@/infrastructure/db/mongodb/repositories/card.repository";

container.register("Middleware", {
  useClass: Middleware,
});

// controllers registation
container.register("AuthController", {
  useClass: AuthController,
});
container.register("UserController", {
  useClass: UserController,
});

// services registation
container.register("UserService", {
  useClass: UserService,
});
container.register("SessionService", {
  useClass: SessionService,
});
container.register("AuthService", {
  useClass: AuthService,
});
container.register("CardService", {
  useClass: CardService,
});
container.register("CryptoService", {
  useClass: CryptoService,
});

// repositories registation
container.register("UserRepository", {
  useClass: UserRepository,
});
container.register("SessionRepository", {
  useClass: SessionRepository,
});
container.register("CardRepository", {
  useClass: CardRepository,
});

export default container;
