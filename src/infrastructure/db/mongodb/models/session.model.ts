import mongoose, { Schema } from "mongoose";
import { Session } from "@/domain/entities/session.entity";

const sessionSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    expiredAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

sessionSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = mongoose.model<Session>("Session", sessionSchema);
