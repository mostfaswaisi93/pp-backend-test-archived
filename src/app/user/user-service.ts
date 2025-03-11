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
    try {
      if (
        !userData.password ||
        !this.passwordCheckService.checkPasswordValidity(userData.password)
      ) {
        throw new InvalidInputException(i18n.__("complex_password_required"));
      }

      if (await User.exists({ email: userData.email })) {
        throw new InvalidInputException(i18n.__("email_already_exists"));
      }

      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllUsers() {
    try {
      return await User.find();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await User.findById(id);
      if (!user) throw new InvalidInputException(i18n.__("user_not_found"));
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, userData: Partial<IUser>) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, userData, {
        new: true,
      });
      if (!updatedUser)
        throw new InvalidInputException(i18n.__("user_not_found"));
      return updatedUser;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string) {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) throw new InvalidInputException(i18n.__("user_not_found"));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    throw new InvalidInputException(i18n.__("operation_failed"));
  }
}
