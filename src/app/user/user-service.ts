import { InvalidInputException } from "../../commons/errors/exceptions";
import * as i18n from "i18n";
import { PasswordCheckService } from "../../commons/validators/password-check-service";
import User from "../../models/user/user.model";
import { IUser } from "../../models/user/user.interface";

export class UserService {
  private static _instance: UserService;
  private passwordCheckService = PasswordCheckService.Instance;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(userData: Partial<IUser>) {
    if (
      !userData.password ||
      !this.passwordCheckService.checkPasswordValidity(userData.password)
    ) {
      throw new InvalidInputException(i18n.__("complex_password_required"));
    }

    if (await User.exists({ email: userData.email })) {
      throw new InvalidInputException(i18n.__("email_already_exist"));
    }

    if (await User.exists({ phone: userData.phone })) {
      throw new InvalidInputException(i18n.__("mobile_already_exist"));
    }

    if (await User.exists({ nameAr: userData.nameAr })) {
      throw new InvalidInputException(i18n.__("name_already_exist"));
    }

    if (await User.exists({ nameEn: userData.nameEn })) {
      throw new InvalidInputException(i18n.__("name_already_exist"));
    }

    const user = new User(userData);
    return await user.save();
  }

  async getAllUsers() {
    return await User.find();
  }

  async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) throw new InvalidInputException(i18n.__("user_not_found"));
    return user;
  }

  async update(id: string, userData: Partial<IUser>) {
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });
    if (!updatedUser)
      throw new InvalidInputException(i18n.__("user_not_found"));
    return updatedUser;
  }

  async delete(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new InvalidInputException(i18n.__("user_not_found"));
  }
}
