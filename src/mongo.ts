import mongoose from "mongoose";
import { config } from "./config";

mongoose.connect(config.DATABASE_URL, { bufferCommands: false });

export const dbConnection = mongoose.connection;
