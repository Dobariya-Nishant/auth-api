import { UserController } from "@/api/controllers/user.controller";
import { UserService } from "@/domain/services/user.service";
import { container } from "tsyringe";

// controllers registation
container.register("UserController", {
  useClass: UserController,
});

container.register("UserService", {
  useClass: UserService,
});

// //repository registation
// container.register("UserRepository", {
//   useClass: UserRepository,
// });

export default container;
