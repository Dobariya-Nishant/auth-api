import { Schema, model, Types } from "mongoose";

import {
  CardContentTypeEnum,
  CardOrientationEnum,
} from "@/domain/enum/card.enum";
import { Card, CardDetails } from "@/domain/entities/card.entity";

const CardDetailsSchema = new Schema<CardDetails>({
  color: { type: String },
  smallImage: { type: String, required: true },
  backGroundImage: { type: String, required: true },
  content: [
    {
      type: {
        type: String,
        enum: Object.values(CardContentTypeEnum),
        required: true,
      },
      url: { type: String },
      fontSize: { type: Number },
      text: { type: String },
      color: { type: String },
      fontFamily: { type: String },
      fill: { type: String },
      shadowColor: { type: String },
      left: { type: Number },
      top: { type: Number },
      scaleX: { type: Number },
      scaleY: { type: Number },
      angle: { type: Number },
    },
  ],
});

const CardSchema = new Schema<Card>({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  //@ts-ignore
  templateId: {
    type: Types.ObjectId,
    ref: "Card",
  },
  //@ts-ignore
  userId: {
    type: Types.ObjectId,
    ref: "User",
  },
  orientation: {
    type: String,
    enum: Object.values(CardOrientationEnum),
    default: CardOrientationEnum.PORTRAIT,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  //@ts-ignore
  cardsDetails: {
    type: CardDetailsSchema,
    default: [],
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    default: 0,
  },
  categories: {
    type: [String],
    default: [],
  },
});

const CardModel = model<Card>("Card", CardSchema);

export { CardModel };
