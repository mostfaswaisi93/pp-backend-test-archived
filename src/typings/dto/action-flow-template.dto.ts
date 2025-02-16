import { LANG_LIST } from "@typings/enums/defualts.enum";
import { completeTranslate } from "@utils/language";
import { getAttributeLang } from "@utils/translateObject";
import { Translatable } from "../interfaces/translation.interface";

export class CreateUpdateActionFlowInput {
  id?: number;
  actionType?: number;
  flowType?: number;
  templateNameAr?: string;
  templateNameEn?: string;

  default?: boolean;
  details?: ActionDetailsInput[];
  applyOn?: number[];
  translatable?: Array<Translatable>;
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    if (data) {
      if (data.translatable) {
        this.translatable = completeTranslate(data.translatable);
        this.templateNameAr = getAttributeLang(
          this.translatable,
          "templateName",
          LANG_LIST.Ar
        );
        this.templateNameEn = getAttributeLang(
          this.translatable,
          "templateName",
          LANG_LIST.En
        );
      }
      this.id = data.templateId || null;
      this.actionType = data.actionType || null;
      this.flowType = data.flowType || null;
      this.default = data.default || false;
      this.details = data.details
        ? data.details.map((row: any) => new ActionDetailsInput(row))
        : [];
      this.applyOn = data.applyOn || [];
    }
  }
}

export class ActionDetailsInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    if (data) {
      this.srcDirectorate = data.srcDirectorate || null;
      this.srcTitle = data.srcTitle || null;
      this.destDirectorate = data.destDirectorate || null;
      this.destTitle = data.destTitle || null;
      this.employees = data.employees || [];
    }
  }
  srcDirectorate?: number;
  srcTitle?: number;
  destDirectorate?: number;
  destTitle?: number;
  employees?: number[];
}
