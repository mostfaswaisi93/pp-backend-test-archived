import mongoose, { Schema, Document } from "mongoose";

// تعريف واجهة المستخدم
export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // إضافة الطابع الزمني
);

// إنشاء نموذج المستخدم
export const User = mongoose.model<IUser>("User", userSchema);
