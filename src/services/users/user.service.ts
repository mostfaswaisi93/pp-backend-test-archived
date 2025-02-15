// import User from "../../models/users/user.model"; // استيراد نموذج المستخدم من موديول الـ Mongoose
import { User } from "../../models/users/user.model";
import { IUser } from "../../models/users/user.interface"; // واجهة المستخدم (تحتاج إلى إعدادها)

class UserService {
  // إنشاء مستخدم جديد
  async createUser(email: string, password: string) {
    const user = new User({
      email,
      password,
    });

    await user.save(); // حفظ المستخدم في قاعدة البيانات
    return user; // إرجاع الكائن المستخدم الذي تم حفظه
  }

  // الحصول على جميع المستخدمين
  async getAllUsers(): Promise<IUser[]> {
    return User.find(); // إرجاع قائمة بجميع المستخدمين
  }

  // الحصول على مستخدم باستخدام معرفه
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId); // إرجاع المستخدم بناءً على المعرف
  }

  // تحديث بيانات المستخدم
  async updateUser(userId: string, email: string, password: string) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, password },
      { new: true } // إعادة المستخدم بعد التحديث
    );
    return updatedUser; // إرجاع المستخدم المحدث
  }

  // حذف مستخدم
  async deleteUser(userId: string): Promise<IUser | null> {
    return User.findByIdAndDelete(userId); // حذف المستخدم بناءً على المعرف
  }
}

export default new UserService(); // تصدير خدمة المستخدم ككائن واحد
