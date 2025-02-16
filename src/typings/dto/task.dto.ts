import { WEEK_DAY_NAMES } from "@typings/enums/defualts.enum";
import { completeTranslate } from "@utils/language";
import moment from "moment";
import { Translatable } from "../interfaces/translation.interface";

export class RecurringInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    if (data) {
      Object.assign(this, data);
      this.RecurringEndDate = this.RecurringEndDate;
      if (!Array.isArray(data.wDays) && WEEK_DAY_NAMES[data.wDays])
        this.wDays = [data.wDays];
      if (!Array.isArray(data.wDays)) this.wDays = [];
      this.wDays = this.wDays.map((d) => +d);
      this.RecurringStartDate = this.RecurringStartDate;
    }
  }
  MakeNewRecurringSetting: boolean;
  RecurringSettingId: number;
  RecurringStartDate: Date;
  RecurringEndDate: Date;
  RecurringOccurrences: number;
  RecurringEvery: number;
  wDays: any[];
  RecurringMonthDay: number;
  RecurringPositionId: number;
  RecurringWeekDayId: number;
  RecurringMonthId: number;
  RecurringTypeId: number;
  RecurringEnabled: number;
}
export class TaskInput extends RecurringInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    super();
    Object.assign(this, data);
    if (this.dependencyType == "") this.dependencyType = null;
    this.wDays = this.wDays || [];

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
  productId: number;
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
