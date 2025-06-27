import mongoose, { Schema } from "mongoose";
import { User } from "@/domain/entities/user.entity";
import { RoleTypeEnum } from "@/domain/enum/user.enum";

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    userName: { type: String },
    authType: { type: String, required: true },
    role: { type: String, default: RoleTypeEnum.USER },
    permissions: { type: [String] },
    profilePicture: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>("User", UserSchema);
