import { RoleTypeEnum } from "@/domain/enum/user.enum";
import {
  CardContentTypeEnum,
  CardOrientationEnum,
} from "@/domain/enum/card.enum";

export interface CardDetails {
  color: string;
  smallImage: string;
  backGroundImage: string;
  content: [
    {
      type: CardContentTypeEnum;
      fontSize: number;
      text: string;
      color: string;
      fontFamily: string;
      fill: string;
      shadowColor: string;
      left: number;
      top: number;
      scaleX: number;
      scaleY: number;
      angle: number;
    }
  ];
}

export interface Card {
  name: string;
  role: RoleTypeEnum;
  isPhotoSupport: boolean;
  templateId: string;
  userId: string;
  orientation: CardOrientationEnum;
  isPremium: boolean;
  cardsDetails: CardDetails[];
  isCustom: boolean;
  tags: string[];
  price: number;
  categories: string[];
}
