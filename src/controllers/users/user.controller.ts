import { Request, Response } from "express";
import UserService from "../../services/users/user.service"; // استيراد الخدمة الخاصة بالمستخدم

export class UserController {
  // دالة إنشاء المستخدم
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const newUser = await UserService.createUser(email, password);
      res.status(201).json(newUser); // إرسال الاستجابة مع البيانات التي تم إنشاؤها
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error }); // في حالة حدوث خطأ
    }
  }

  // دالة الحصول على جميع المستخدمين
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users); // إرسال قائمة المستخدمين
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error }); // في حالة حدوث خطأ
    }
  }

  // دالة الحصول على مستخدم واحد
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" }); // في حالة عدم وجود المستخدم
      }

      res.status(200).json(user); // إرسال بيانات المستخدم
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error }); // في حالة حدوث خطأ
    }
  }

  // دالة تعديل بيانات المستخدم
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const { email, password } = req.body;

      const updatedUser = await UserService.updateUser(userId, email, password);

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" }); // في حالة عدم وجود المستخدم
      }

      res.status(200).json(updatedUser); // إرسال البيانات المعدلة
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error }); // في حالة حدوث خطأ
    }
  }

  // دالة حذف مستخدم
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const deletedUser = await UserService.deleteUser(userId);

      if (!deletedUser) {
        res.status(404).json({ message: "User not found" }); // في حالة عدم وجود المستخدم
      }

      res.status(200).json({ message: "User deleted successfully" }); // تأكيد الحذف
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error }); // في حالة حدوث خطأ
    }
  }
}
