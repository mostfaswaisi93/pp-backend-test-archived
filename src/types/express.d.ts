// src/types/express.d.ts
import { User } from "../models/user.model"; // تأكد من أن `User` هو الـ model الذي تستخدمه للمستخدم

declare global {
  namespace Express {
    interface Request {
      user?: User; // نقوم بإضافة خاصية `user` هنا والتي تحتوي على بيانات المستخدم
      pagination?: {
        page: number;
        limit: number;
      };
    }
  }
}
