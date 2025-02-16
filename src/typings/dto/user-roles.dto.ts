import { completeTranslate } from "@utils/language";
import { Translatable } from "../interfaces/translation.interface";

export class UserRolesInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    this.translatable = completeTranslate(this.translatable);
  }
  id: string | number;
  code: string | number;
  selectedFunctions: any[];
  translatable: Array<Translatable>;
}
