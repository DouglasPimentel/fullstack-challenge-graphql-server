import mongoose from "mongoose";

interface UserInterface extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  encryptPassword: (password: string) => string;
  comparePassword: (password: string) => boolean;
}

export default UserInterface;
