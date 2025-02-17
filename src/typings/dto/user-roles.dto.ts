import { completeTranslate } from "../../utils/language";
import { Translatable } from "../interfaces/translation.interface";

export class UserRolesInput {
  id?: string | number;
  code?: string | number;
  selectedFunctions?: any[];
  translatable?: Array<Translatable>;

  constructor(data?: Partial<UserRolesInput>) {
    if (data) {
      Object.assign(this, data);
      if (this.translatable) {
        this.translatable = completeTranslate(this.translatable);
      }
    }
  }
}
