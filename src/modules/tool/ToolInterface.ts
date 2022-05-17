import mongoose from "mongoose";

interface ToolInterface extends mongoose.Document {
  name: string;
  link: string;
  description: string;
  tags: string[];
  userId: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export default ToolInterface;
