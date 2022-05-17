import mongoose from "mongoose";
import ToolInterface from "./ToolInterface";

const ToolSchema = new mongoose.Schema<ToolInterface>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "Tool",
  }
);

const ToolModel: mongoose.Model<ToolInterface> = mongoose.model<
  ToolInterface,
  mongoose.Model<ToolInterface>
>("Tool", ToolSchema);

export default ToolModel;
