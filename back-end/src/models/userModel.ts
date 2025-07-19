import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document<Types.ObjectId> {
  _id: Types.ObjectId; // 👈 explicitly declare the _id type
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  password: string;
  preferences: string[];
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    dob: { type: Date, required: false },
    password: { type: String, required: true },
    preferences: [{ type: String }],
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
