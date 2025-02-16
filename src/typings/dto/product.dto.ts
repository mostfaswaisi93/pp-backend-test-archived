import { LANGUAGE, PROJECT_COPY_TYPE } from "@typings/enums/defualts.enum";
import { completeTranslate } from "@utils/language";
import { Translatable } from "../interfaces/translation.interface";

export class ProductInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    this.translatable = completeTranslate(this.translatable);

    for (let attr of this.ProductAttributes) {
      attr.translatable = completeTranslate(attr.translatable);
    }
  }

  empId: number;
  ProductId: number;
  ProductCode: string;
  productStatusId: number;
  ProductDirectorateId: number;
  ProductAdminId: number;
  TemplateId: number;
  CopyFromProductId: number;
  UploadFileName: string;
  StartDate: string;
  ProductColorId: number;
  translatable: Array<Translatable>;
  copyFromType: PROJECT_COPY_TYPE;
  ProductAttributes: Array<ProductAttributesInput>;
  directoratesPool: Array<number>;
  employeesPool: Array<number>;
  approvalFlowTemplateId: number;
  reportFlowTemplateId: number;
  escalationFlowTemplateId: number;
  calendarTemplateId: number;
}

export interface ProductAttributesInput {
  id: number;
  TypeId: number;
  value: any;
  translatable: Array<Translatable>;
}
