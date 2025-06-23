import { FastifyEnvOptions } from "@fastify/env";

export const envSchema: FastifyEnvOptions = {
  schema: {
    type: "object",
    required: [
      "PORT",
      "PUBLIC_ACCESS_TOKEN_KEY",
      "PRIVATE_ACCESS_TOKEN_KEY",
      "PUBLIC_REFRESH_TOKEN_KEY",
      "PRIVATE_REFRESH_TOKEN_KEY",
      "MONGODB_URI",
      "X_API_KEY",
    ],
    properties: {
      PORT: { type: "string", default: "3000" },
      NODE_ENV: {
        type: "string",
        enum: ["development", "production", "staging"],
        default: "development",
      },
      PUBLIC_ACCESS_TOKEN_KEY: { type: "string" },
      PRIVATE_ACCESS_TOKEN_KEY: { type: "string" },
      PUBLIC_REFRESH_TOKEN_KEY: { type: "string" },
      PRIVATE_REFRESH_TOKEN_KEY: { type: "string" },
      MONGODB_URI: {
        type: "string",
        default: "mongodb://localhost:27017/test",
      },
      X_API_KEY: {
        type: "string",
      },
    },
  },
  dotenv: true,
};
