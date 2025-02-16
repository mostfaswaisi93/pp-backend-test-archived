import { REPORT_ESCALACTION_TARGET_TYPES } from "@typings/enums/defualts.enum";

export class CreateUpdateReportEscalationInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    this.TargetEmployees = this.TargetEmployees || [];
  }
  TargetEmployees: Array<number>;
  description: string;
  fileUploadControl?: any;
  files: any;
  isDraft: number;
  isUrgent: number;
  productId: number;
  reportId: number;
  subject: string;
  targetType: REPORT_ESCALACTION_TARGET_TYPES;
  taskId: number;
  type: number;
}
