// src/controllers/users/user.service.ts

class UserService {
  public async createUser(username: string, password: string): Promise<void> {
    // منطق إنشاء المستخدم
    console.log(`تم إنشاء المستخدم: ${username}`);
  }

  // إضافة وظائف أخرى حسب الحاجة
}

// تصدير كائن `UserService`
export default new UserService(); // هنا يتم تصدير instance مباشرة
