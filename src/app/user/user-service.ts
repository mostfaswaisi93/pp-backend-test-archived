import {
  InvalidInputException,
  NotFoundException,
  UserNotFoundException,
} from "../../commons/errors/exceptions";
import * as i18n from "i18n";
import { getRepository, Not } from "typeorm";
import { User } from "../../database/entity/User";
import { PasswordCheckService } from "../../commons/validators/password-check-service";
import AuthService from "../auth/auth-service";
import {
  ACTION_LOG_REF_TYPE,
  ACTION_LOG_TYPE,
  USER_TYPES,
} from "../../commons/constants/constants";
import { AgencyService } from "../agency/AgencyService";
import { ActionLogService } from "../../commons/services/ActionLogService";

export class UserService {
  private ActionLogService: ActionLogService = ActionLogService.Instance;
  private userRepository = getRepository(User);
  private passwordCheckService: PasswordCheckService =
    PasswordCheckService.Instance;
  private authService: AuthService = AuthService.Instance;
  private agencyService: AgencyService = AgencyService.Instance;
  private static _instance;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  private async isEmailOrPhoneExist(
    email: string,
    phone: string,
    excludeId: string = null
  ) {
    const emailExists = await this.userRepository.findOne({
      email,
      userId: Not(excludeId),
    });
    if (emailExists)
      throw new InvalidInputException(i18n.__("email_already_exist"));

    const phoneExists = await this.userRepository.findOne({
      phone,
      userId: Not(excludeId),
    });
    if (phoneExists)
      throw new InvalidInputException(i18n.__("mobile_already_exist"));
  }

  private async checkUserExistence(user: User, excludeId: string = null) {
    if (user.email)
      await this.isEmailOrPhoneExist(
        user.email.toLowerCase().trim(),
        user.phone,
        excludeId
      );
    if (user.nameAr || user.nameEn) {
      await this.checkNameExistence(user.nameAr, user.nameEn, excludeId);
    }
  }

  private async checkNameExistence(
    nameAr: string,
    nameEn: string,
    excludeId: string = null
  ) {
    if (nameAr) {
      const nameArExist = await this.userRepository.findOne({
        nameAr,
        userId: Not(excludeId),
      });
      if (nameArExist)
        throw new InvalidInputException(i18n.__("name_already_exist"));
    }

    if (nameEn) {
      const nameEnExist = await this.userRepository.findOne({
        nameEn,
        userId: Not(excludeId),
      });
      if (nameEnExist)
        throw new InvalidInputException(i18n.__("name_already_exist"));
    }
  }

  private async validateAgency(agencyId: string) {
    if (agencyId) {
      const agency = await this.agencyService.findById(agencyId);
      if (!agency) throw new InvalidInputException(i18n.__("agency_not_found"));
    }
  }

  async all(agencyId: string, withAdmin: boolean = false): Promise<User[]> {
    const where: any = {
      agency: agencyId && agencyId !== "null" ? agencyId : undefined,
    };
    if (!withAdmin) where.userType = USER_TYPES.Data;
    return this.userRepository.find({ where, relations: ["agency"] });
  }

  async active(agencyId: string): Promise<User[]> {
    const where: any = {
      active: 1,
      userType: USER_TYPES.Data,
      agency: agencyId && agencyId !== "null" ? agencyId : undefined,
    };
    return this.userRepository.find({ where, relations: ["agency"] });
  }

  async ncsi(): Promise<User[]> {
    return this.userRepository.find({
      where: { agency: "ncsiID", active: 1, userType: USER_TYPES.Data },
      relations: ["agency"],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId: id, active: 1 },
      relations: ["agency"],
    });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase().trim(), active: 1 },
      relations: ["agency"],
    });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async create(user: User) {
    if (
      !user.password ||
      !this.passwordCheckService.checkPasswordValidaty(user.password)
    ) {
      throw new InvalidInputException(i18n.__("complex_password_required"));
    }

    await this.checkUserExistence(user);
    await this.validateAgency(user.agency);

    const createdUser = await this.userRepository.save(user);
    this.ActionLogService.insertAction(
      ACTION_LOG_TYPE.ADD_USER,
      { user_name: createdUser.nameEn },
      createdUser.updatedBy,
      ACTION_LOG_REF_TYPE.USER,
      createdUser.userId
    );

    return createdUser;
  }

  async update(id: string, user: User) {
    const existUser = await this.userRepository.findOne({ userId: id });
    if (!existUser) throw new UserNotFoundException();

    await this.checkUserExistence(user, id);
    await this.validateAgency(user.agency);

    Object.assign(existUser, user);

    if (
      user.password &&
      !this.passwordCheckService.checkPasswordValidaty(user.password)
    ) {
      throw new InvalidInputException(i18n.__("complex_password_required"));
    }

    const result = await this.userRepository.save(existUser);
    this.ActionLogService.insertAction(
      ACTION_LOG_TYPE.EDIT_USER,
      { user_name: existUser.nameEn },
      existUser.updatedBy,
      ACTION_LOG_REF_TYPE.USER,
      existUser.userId
    );

    return result;
  }

  async resetPassword(
    newPassword: string,
    oldPassword: string,
    userId: string
  ) {
    if (
      !newPassword ||
      !this.passwordCheckService.checkPasswordValidaty(newPassword)
    ) {
      throw new InvalidInputException(i18n.__("complex_password_required"));
    }

    const user = await this.userRepository.findOne({ userId });
    if (!user) throw new UserNotFoundException(i18n.__("user_not_found"));

    if (!this.authService.validPassword(oldPassword, user.password)) {
      throw new InvalidInputException(i18n.__("old_password_not_correct"));
    }

    user.password = newPassword;
    return this.userRepository.save(user);
  }

  async updateActive(id: string, active: number, userId: string) {
    const user = await this.userRepository.findOne({ userId: id });
    if (!user) throw new UserNotFoundException(i18n.__("user_not_found"));

    if (active === 2 && user.active === 1) {
      user.deactivateDate = new Date();
    } else if (active === 1) {
      user.deactivateDate = null;
    }

    user.active = active;
    user.updatedBy = userId;

    return this.userRepository.save(user);
  }
}
