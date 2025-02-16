import { completeTranslate } from "@utils/language";
import { Translatable } from "../interfaces/translation.interface";

export class HierarchyRoleInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    this.translatable = completeTranslate(this.translatable);
  }
  id: string | number;
  code: string;
  translatable: Array<Translatable>;
  hirarchyId: number;
  defaultRoleId: number;
  flag: boolean;
}
