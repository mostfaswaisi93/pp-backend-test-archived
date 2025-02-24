import {
  InvalidInputException,
  UserNotFoundException,
} from "../../commons/errors/exceptions";
import * as i18n from "i18n";
import mongoose from "mongoose";
import { PasswordCheckService } from "../../commons/validators/password-check-service";
import AuthService from "../auth/auth-service";
import { IUser } from "../../models/user/user.interface";
import UserModel from "../../models/user/user.model"; // افتراض أنك تستخدم موديل MongoDB حقيقي

export class UserService {
  private static _instance: UserService;
  private passwordCheckService = PasswordCheckService.Instance;
  private authService = AuthService.Instance;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  private async isEmailOrPhoneExist(
    email: string,
    phone: string,
    excludeId?: string
  ) {
    // تعديل لاستخدام MongoDB بدلاً من المصفوفة
    const userExists = await UserModel.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: excludeId },
    });
    if (userExists) {
      throw new InvalidInputException(i18n.__("email_or_phone_already_exist"));
    }
  }

  // async all(withAdmin: any = false): Promise<IUser[]> {
  // 	let where: any = {};
  // 	let users: IUser[] = await this.userRepository.find({
  // 		where: where,
  // 	});
  // 	return users;
  // }

  async findById(id: string): Promise<IUser> {
    const user = await UserModel.findById(id).where("active").equals(true);
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
      active: true,
    });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async create(user: IUser) {
    if (
      !user.password ||
      !this.passwordCheckService.checkPasswordValidity(user.password)
    ) {
      throw new InvalidInputException(i18n.__("complex_password_required"));
    }

    // await this.isEmailOrPhoneExist(user.email, user.userName);
    const newUser: IUser = new UserModel({
      ...user,
      _id: new mongoose.Types.ObjectId(), // سيتم توليد _id بواسطة MongoDB عند حفظ البيانات
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newUser.save(); // حفظ المستخدم في قاعدة البيانات
    return newUser;
  }

  async update(id: string, user: Partial<IUser>) {
    const existingUser = await this.findById(id);
    Object.assign(existingUser, user);
    // existingUser.updatedAt = new Date();
    await existingUser.save(); // حفظ التعديلات في قاعدة البيانات
    return existingUser;
  }

  async resetPassword(
    newPassword: string,
    oldPassword: string,
    userId: string
  ) {
    if (!this.passwordCheckService.checkPasswordValidity(newPassword)) {
      throw new InvalidInputException(i18n.__("complex_password_required"));
    }

    const user = await this.findById(userId);
    if (!this.authService.validPassword(oldPassword, user.password)) {
      throw new InvalidInputException(i18n.__("old_password_not_correct"));
    }

    user.password = newPassword;
    // user.updatedAt = new Date();
    await user.save(); // حفظ كلمة المرور الجديدة
    return user;
  }

  async updateActive(id: string, active: boolean) {
    const user = await this.findById(id);
    // user.active = active;
    // user.updatedAt = new Date();
    await user.save(); // حفظ التحديث
    return user;
  }
}
