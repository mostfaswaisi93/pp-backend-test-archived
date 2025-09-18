import bcrypt from "bcrypt";
import * as i18n from "i18n";
import { ObjectId } from "mongodb";
import User from "../../models/user/user.model";
import { Logger } from "../../commons/libs/logger";
import { IUser } from "../../models/user/user.interface";
import { Status } from "../../commons/constants/constants";
import { PasswordCheckService } from "../../commons/validators/password-check-service";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

const logger = Logger.Instance;

export class UserService {
  private static _instance: UserService;
  private passwordCheckService = PasswordCheckService.Instance;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      if (!userData.email || !userData.phoneNumber) {
        throw new InvalidInputException(i18n.__("email_and_phone_required"));
      }

      if (
        !userData.password ||
        !this.passwordCheckService.checkPasswordValidity(userData.password)
      ) {
        throw new InvalidInputException(i18n.__("complex_password_required"));
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const [emailExists, phoneExists] = await Promise.all([
        User.findOne({ email: userData.email, isDeleted: false }),
        User.findOne({ phoneNumber: userData.phoneNumber, isDeleted: false }),
      ]);

      if (emailExists) {
        throw new InvalidInputException(i18n.__("email_already_exists"));
      }
      if (phoneExists) {
        throw new InvalidInputException(i18n.__("phone_already_exists"));
      }

      const user = new User({
        firebaseUID: userData.firebaseUID || "",
        deviceId: userData.deviceId || "",
        email: userData.email.trim().toLowerCase(),
        password: hashedPassword,
        tempPassword: userData.tempPassword ?? null,
        phoneNumber: userData.phoneNumber,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        image: userData.image || [],
        proEmail: userData.proEmail ?? null,
        proId: userData.proId || "",
        emailVerificationCode: userData.emailVerificationCode ?? null,
        mobileVerificationCode: userData.mobileVerificationCode ?? null,
        roles: userData.roles || [],
        permissions: userData.permissions || [],
        vanlynk: userData.vanlynk ?? null,
        leadgen: userData.leadgen ?? null,
        companyName: userData.companyName ?? null,
        companyLogo: userData.companyLogo ?? null,
        isUserRegComplete: userData.isUserRegComplete ?? false,
        isLeadRegComplete: userData.isLeadRegComplete ?? false,
        isVanlynkRegComplete: userData.isVanlynkRegComplete ?? false,
        isVerified: userData.isVerified ?? false,
        isEmailVerified: userData.isEmailVerified ?? false,
        isMobileVerified: userData.isMobileVerified ?? false,
        status: userData.status ?? Status.ACTIVE,
        isDeleted: false,
        isDeactivated: false,
      });

      const savedUser = await user.save();
      logger.info("User created successfully", { user: savedUser });
      return savedUser;
    } catch (error: any) {
      logger.error("Failed to create user", { error, userData });
      throw error;
    }
  }

  public async getUsers(status?: string, email?: string, fields?: string) {
    try {
      const filter: any = { isDeleted: false };
      if (status) filter.status = status;
      if (email) filter.email = email;

      const projection = fields ? fields.split(",").join(" ") : "";

      const users = await User.find(filter, projection).sort({ firstName: -1 });

      if (users.length === 0) {
        logger.warn("No users found", { status, email, fields });
        throw new InvalidInputException("Users not found");
      }

      logger.info("Users retrieved", { count: users.length });
      return users;
    } catch (error: any) {
      logger.error("Failed to get users", { error, status, email, fields });
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await User.findById(id)
        .populate("roles")
        .populate("permissions");

      if (!user || user.isDeleted) {
        logger.warn("User not found by ID", { id });
        throw new NotFoundException(i18n.__("user_not_found"));
      }

      logger.info("User retrieved by ID", { id, user });
      return user;
    } catch (error: any) {
      logger.error("Failed to get user by ID", { error, id });
      throw error;
    }
  }

  async update(id: string, data: Partial<IUser>) {
    try {
      const user = await User.findById(id);
      if (!user || user.isDeleted) {
        logger.warn("User not found for update", { id });
        throw new NotFoundException(i18n.__("user_not_found"));
      }

      if (data.email && data.email !== user.email) {
        const emailExists = await User.findOne({
          email: data.email,
          isDeleted: false,
        });
        if (emailExists) {
          throw new InvalidInputException(i18n.__("email_already_exists"));
        }
      }

      if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
        const phoneExists = await User.findOne({
          phoneNumber: data.phoneNumber,
          isDeleted: false,
        });
        if (phoneExists) {
          throw new InvalidInputException(i18n.__("phone_already_exists"));
        }
      }

      let newPassword = user.password;
      if (data.password) {
        if (!this.passwordCheckService.checkPasswordValidity(data.password)) {
          throw new InvalidInputException(i18n.__("complex_password_required"));
        }
        newPassword = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            firebaseUID: data.firebaseUID ?? user.firebaseUID,
            deviceId: data.deviceId ?? user.deviceId,
            email: data.email ?? user.email,
            password: newPassword,
            tempPassword: data.tempPassword ?? user.tempPassword,
            phoneNumber: data.phoneNumber ?? user.phoneNumber,
            firstName: data.firstName ?? user.firstName,
            lastName: data.lastName ?? user.lastName,
            image: data.image ?? user.image,
            proEmail: data.proEmail ?? user.proEmail,
            proId: data.proId ?? user.proId,
            emailVerificationCode:
              data.emailVerificationCode ?? user.emailVerificationCode,
            mobileVerificationCode:
              data.mobileVerificationCode ?? user.mobileVerificationCode,
            roles: data.roles ?? user.roles,
            permissions: data.permissions ?? user.permissions,
            vanlynk: data.vanlynk ?? user.vanlynk,
            leadgen: data.leadgen ?? user.leadgen,
            companyName: data.companyName ?? user.companyName,
            companyLogo: data.companyLogo ?? user.companyLogo,
            isUserRegComplete: data.isUserRegComplete ?? user.isUserRegComplete,
            isLeadRegComplete: data.isLeadRegComplete ?? user.isLeadRegComplete,
            isVanlynkRegComplete:
              data.isVanlynkRegComplete ?? user.isVanlynkRegComplete,
            isVerified: data.isVerified ?? user.isVerified,
            isEmailVerified: data.isEmailVerified ?? user.isEmailVerified,
            isMobileVerified: data.isMobileVerified ?? user.isMobileVerified,
            status: data.status ?? user.status,
            isDeleted: data.isDeleted ?? user.isDeleted,
            isDeactivated: data.isDeactivated ?? user.isDeactivated,
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        logger.warn("User not found after update attempt", { id });
        throw new InvalidInputException("User not found");
      }

      logger.info("User updated successfully", { id, updatedUser });
      return updatedUser;
    } catch (error: any) {
      logger.error("Failed to update user", { error, id, data });
      throw error;
    }
  }

  public async updateStatus(_id: string, data: IUser) {
    try {
      let user = await User.findOne({ _id });
      if (!user || user.isDeleted) {
        logger.warn("User not found for status update", { _id });
        throw new NotFoundException();
      }

      let updatedStatus = await User.findByIdAndUpdate(
        _id,
        { $set: { status: data.status || user.status } },
        { new: true }
      );

      if (!updatedStatus) {
        logger.warn("User not found after status update attempt", { _id });
        throw new InvalidInputException("User not found");
      }

      logger.info("User status updated successfully", { _id, updatedStatus });
      return updatedStatus;
    } catch (error: any) {
      logger.error("Failed to update user status", { error, _id, data });
      throw error;
    }
  }

  public async delete(_id: string) {
    try {
      const user = await User.findById(_id);
      if (!user || user.isDeleted) {
        logger.warn("User not found for deletion", { _id });
        throw new InvalidInputException("User not found");
      }

      user.isDeleted = true;
      user.status = Status.ACTIVE;

      const deletedUser = await user.save();
      logger.info("User soft deleted successfully", { _id, deletedUser });
      return deletedUser;
    } catch (error: any) {
      logger.error("Failed to soft delete user", { error, _id });
      throw error;
    }
  }

  public async restore(_id: string): Promise<IUser> {
    try {
      const userRaw = await User.collection.findOne({ _id: new ObjectId(_id) });
      if (!userRaw) {
        logger.warn("User not found for restore", { _id });
        throw new InvalidInputException("User not found");
      }

      const user = await User.findById(_id);
      if (!user) {
        throw new InvalidInputException("User could not be restored");
      }

      user.isDeleted = false;
      user.status = Status.ACTIVE;

      const restoredUser = await user.save();

      logger.info("User restored successfully", {
        _id,
        restoredUser,
      });

      return restoredUser;
    } catch (error: any) {
      logger.error("Failed to restore user", { error, _id });
      throw error;
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const user = await User.findById(userId);

      if (!user || user.isDeleted) {
        logger.warn("User not found for password change", { userId });
        throw new NotFoundException(i18n.__("user_not_found"));
      }

      if (!user.password) {
        logger.error("User password not set", { userId });
        throw new InvalidInputException(i18n.__("password_not_set"));
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        logger.warn("Invalid old password attempt", { userId });
        throw new InvalidInputException(i18n.__("invalid_old_password"));
      }

      if (
        !newPassword ||
        !this.passwordCheckService.checkPasswordValidity(newPassword)
      ) {
        throw new InvalidInputException(i18n.__("complex_password_required"));
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      const updatedUser = await user.save();

      logger.info("Password changed successfully", { userId });
      return updatedUser;
    } catch (error: any) {
      logger.error("Failed to change password", { error, userId });
      throw error;
    }
  }

  async updateMyProfile(userId: string, data: Partial<IUser>) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundException(i18n.__("user_not_found"));

      if (data.email && data.email !== user.email) {
        const emailExists = await User.findOne({ email: data.email });
        if (emailExists && emailExists._id.toString() !== userId) {
          throw new InvalidInputException(i18n.__("email_already_exists"));
        }
      }

      if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
        const phoneExists = await User.findOne({
          phoneNumber: data.phoneNumber,
        });
        if (phoneExists && phoneExists._id.toString() !== userId) {
          throw new InvalidInputException(i18n.__("phone_already_exists"));
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            firstName: data.firstName ?? user.firstName,
            lastName: data.lastName ?? user.lastName,
            email: data.email ?? user.email,
            phoneNumber: data.phoneNumber ?? user.phoneNumber,
            image: data.image ?? user.image,
          },
        },
        { new: true, runValidators: true }
      );

      logger.info("User updated their profile successfully", {
        userId,
        updatedUser,
      });
      return updatedUser;
    } catch (error: any) {
      logger.error("Failed to update user profile", { error, userId, data });
      throw error;
    }
  }
}
