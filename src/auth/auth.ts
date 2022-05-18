import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthTokenPayload } from "../types";

type UserType = {
  _id: string;
};

export function generateToken(user: UserType) {
  return `JWT ${jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: 60 * 60,
  })}`;
}

export function decodeToken(authHeader: string) {
  const token = authHeader.replace("JWT ", "");

  if (!token) {
    throw new Error("No token found");
  }

  return jwt.verify(token, config.JWT_SECRET) as AuthTokenPayload;
}
