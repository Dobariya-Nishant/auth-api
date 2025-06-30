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

// controllers registation
container.register("AuthController", {
  useClass: AuthController,
});
container.register("UserController", {
  useClass: UserController,
});

container.register("UserService", {
  useClass: UserService,
});
container.register("SessionService", {
  useClass: SessionService,
});
container.register("AuthService", {
  useClass: AuthService,
});
container.register("CryptoService", {
  useClass: CryptoService,
});

container.register("UserRepository", {
  useClass: UserRepository,
});
container.register("SessionRepository", {
  useClass: SessionRepository,
});

export default container;
