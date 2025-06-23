import { AuthTypeEnum, RoleTypeEnum } from "@/domain/enum/user.enum";

export interface User {
  _id: string;
  email: string;
  password?: string;
  userName: string;
  authType: AuthTypeEnum;
  role: RoleTypeEnum;
  permissions?: [RoleTypeEnum];
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
