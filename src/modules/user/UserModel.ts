import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserInterface from "./UserInterface";

const UserSchema = new mongoose.Schema<UserInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "User",
  }
);

UserSchema.pre<UserInterface>("save", function encryptPasswordHook(next): void {
  if (this.isModified("password")) {
    this.password = this.encryptPassword(this.password);
  }

  next();
});

UserSchema.methods = {
  comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  },
  encryptPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  },
};

const UserModel: mongoose.Model<UserInterface> = mongoose.model<
  UserInterface,
  mongoose.Model<UserInterface>
>("User", UserSchema);

export default UserModel;
