import { InvalidInputException } from "../../commons/errors/exceptions";
import * as i18n from "i18n";
import { PasswordCheckService } from "../../commons/validators/password-check-service";
import { IPro } from "../../models/pro/pro.interface";
import Pro from "../../models/pro/pro.model";

export class ProService {
  private static _instance: ProService;
  private passwordCheckService = PasswordCheckService.Instance;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(proData: Partial<IPro>) {
    // if (
    //   !proData.password ||
    //   !this.passwordCheckService.checkPasswordValidity(proData.password)
    // ) {
    //   throw new InvalidInputException(i18n.__("complex_password_required"));
    // }

    // if (await Pro.exists({ email: proData.email })) {
    //   throw new InvalidInputException(i18n.__("email_already_exists"));
    // }

    // if (await Pro.exists({ phone: proData.phone })) {
    //   throw new InvalidInputException(i18n.__("mobile_already_exists"));
    // }

    // if (await Pro.exists({ nameAr: proData.nameAr })) {
    //   throw new InvalidInputException(i18n.__("name_already_exists"));
    // }

    // if (await Pro.exists({ nameEn: proData.nameEn })) {
    //   throw new InvalidInputException(i18n.__("name_already_exists"));
    // }

    const pro = new Pro(proData);
    return await pro.save();
  }

  async getAllPros() {
    return await Pro.find();
  }

  async getProById(id: string) {
    const pro = await Pro.findById(id);
    if (!pro) throw new InvalidInputException(i18n.__("pro_not_found"));
    return pro;
  }

  async update(id: string, proData: Partial<IPro>) {
    const updatedPro = await Pro.findByIdAndUpdate(id, proData, {
      new: true,
    });
    if (!updatedPro) throw new InvalidInputException(i18n.__("pro_not_found"));
    return updatedPro;
  }

  async delete(id: string) {
    const pro = await Pro.findByIdAndDelete(id);
    if (!pro) throw new InvalidInputException(i18n.__("pro_not_found"));
  }
}
