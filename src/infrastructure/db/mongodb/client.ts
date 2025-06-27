import { env } from "@/api/server";
import mongoose from "mongoose";

export async function dbConnect() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("DB connected");
  } catch (error) {
    console.error("error while DB connection: ", error);
    process.exit(1);
  }
}
