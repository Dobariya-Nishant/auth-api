import mongoose from "mongoose";

export function getObjectId(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw Error("Invalid ObjectId");
  }
  return new mongoose.Types.ObjectId(id);
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
