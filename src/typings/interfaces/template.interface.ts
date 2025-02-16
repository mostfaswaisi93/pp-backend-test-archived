import { completeTranslate } from "@utils/language";
import { Translatable } from "./translation.interface";

export class TemplateInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    this.translatable = completeTranslate(this.translatable);

    for (let attr of this.templateAttributes) {
      attr.translatable = completeTranslate(attr.translatable);
    }
    this.directoratesPool = this.directoratesPool || [];
    this.templateAttributes = this.templateAttributes || [];
  }
  empId: number;
  id: number;
  CopyFromProductId: number;
  file: string;
  translatable: Array<Translatable>;
  templateColorId: number;
  templateAttributes: Array<TemplateAttributesInput>;
  directoratesPool: Array<number>;
  copyFromType: number;
  copyFromToggle: boolean;
  UploadFileName: string;
}

export interface TemplateAttributesInput {
  id: number;
  TypeId: number;
  value: any;
  translatable: Array<Translatable>;
}
