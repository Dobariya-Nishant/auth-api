import { User } from "@/domain/entities/user.entity";
import { ProjectionFields } from "mongoose";

export const userProjection: ProjectionFields<User> = {
  password: 0,
  authType: 0,
};

export const userProjectionString =
  "email userName fullName profilePicture accountId address";
