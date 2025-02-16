import { completeTranslate } from "@utils/language";
import { Translatable } from "../interfaces/translation.interface";

export class CalendarTemplateInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    this.translatable = completeTranslate(this.translatable);
  }
  id: string | number;
  translatable: Array<Translatable>;
  holidays: any[];
  applyOn: any[];
  saturday: number;
  sunday: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thuersday: number;
  friday: number;
  defaultTemplate: number;
}
