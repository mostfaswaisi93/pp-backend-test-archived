import { LANG_LIST } from "../../typings/enums/defualts.enum";
import { Translatable } from "../../typings/interfaces/translation.interface";
import { completeTranslate } from "../../utils/language";
import { getAttributeLang } from "../../utils/translate";

export class UserInput {
  id?: number;
  lastName?: string;
  lastNameEn?: string;
  firstName?: string;
  firstNameEn?: string;
  countryCodeId?: number;
  directorateId?: number;
  email?: string;
  employeeCode?: string;
  hirarchRoleId?: number;
  mobileNo?: string;
  phoneExt?: string;
  translatable: Translatable[] = []; // تعيين قيمة افتراضية كـ مصفوفة فارغة
  userRoleId?: number;

  constructor(data?: Partial<UserInput>) {
    if (data) {
      Object.assign(this, data);

      if (this.translatable) {
        this.translatable = completeTranslate(this.translatable);
      } else {
        this.translatable = [];
      }

      this.firstName =
        getAttributeLang(this.translatable, "firstName", LANG_LIST.Ar) ?? "";
      this.firstNameEn =
        getAttributeLang(this.translatable, "firstName", LANG_LIST.En) ?? "";
      this.lastName =
        getAttributeLang(this.translatable, "lastName", LANG_LIST.Ar) ?? "";
      this.lastNameEn =
        getAttributeLang(this.translatable, "lastName", LANG_LIST.En) ?? "";
    }
  }
}
