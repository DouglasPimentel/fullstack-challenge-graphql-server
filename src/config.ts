import dotenv from "dotenv";

dotenv.config({});

export const config = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || "shhhhh",
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/test",
};
