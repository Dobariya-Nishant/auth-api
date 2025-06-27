import mongoose from "mongoose";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";

export function getObjectId(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw Error("Invalid ObjectId");
  }
  return new mongoose.Types.ObjectId(id);
}

export function getObjectIds(ids: Array<string>) {
  return ids.map((id) => {
    if (!mongoose.isValidObjectId(id)) {
      throw new UnprocessableEntityError("not valid ObjectId");
    }
    return new mongoose.Types.ObjectId(id);
  });
}

export function getNewObjectId() {
  return new mongoose.Types.ObjectId();
}

export function validateObjectId(value: any, helpers: any) {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}
