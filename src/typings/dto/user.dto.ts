import { LANG_LIST } from "@typings/enums/defualts.enum";
import { Translatable } from "@typings/interfaces/translation.interface";
import { completeTranslate } from "@utils/language";
import { getAttributeLang } from "@utils/translateObject";

export class UserInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    this.translatable = completeTranslate(this.translatable);
    this.firstName = getAttributeLang(
      this.translatable,
      "firstName",
      LANG_LIST.Ar
    );
    this.firstNameEn = getAttributeLang(
      this.translatable,
      "firstName",
      LANG_LIST.En
    );
    this.lastName = getAttributeLang(
      this.translatable,
      "lastName",
      LANG_LIST.Ar
    );
    this.lastNameEn = getAttributeLang(
      this.translatable,
      "lastName",
      LANG_LIST.En
    );
  }
  id: number;
  lastName: string;
  lastNameEn: string;
  firstName: string;
  firstNameEn: string;
  countryCodeId: number;
  directorateId: number;
  email: string;
  employeeCode: string;
  hirarchRoleId: number;
  mobileNo: string;
  phoneExt: string;
  translatable: Translatable[];
  userRoleId: number;
}
