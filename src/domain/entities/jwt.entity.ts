import { RoleTypeEnum } from "@/domain/enum/user.enum";

export interface JwtPayload {
  userId: string;
  role: RoleTypeEnum;
}
