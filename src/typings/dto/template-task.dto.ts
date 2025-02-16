import { completeTranslate } from "@utils/language";
import { Translatable } from "../interfaces/translation.interface";

export class TemplateTaskInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    if (this.dependencyType == "") this.dependencyType = null;
    if (this.translatable)
      this.translatable = completeTranslate(this.translatable);
  }
  taskId: number;
  parentTaskId: number;
  processNoteEn: string;
  processNoteAr: string;
  processNameEn: string;
  processNameAr: string;

  translatable: Array<Translatable>;
  duration: number;
  startDate: Date;
  endDate: Date;
  predcessorTaskId: number;
  taskOrder: number;
  taskStatusGroupId: number;
  dependencyType: string;
  templateId: number;
  empId: number;
  processType: string;
  currentStatus: number;
  taskStatusDetailId: number;
  statusConfirmed: number;
  taskDirectorates: Array<number>;
  assignedEmployees: Array<number>;
}

export interface DependencyTreeNode {
  ID: number;
  PREDECESSORID: number;
  DEPTH: number;
  STARTDATE: Date;
  ENDDATE: Date;
}
