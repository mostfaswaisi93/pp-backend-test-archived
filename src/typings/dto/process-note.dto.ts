import { REPORT_ESCALACTION_TARGET_TYPES } from "@typings/enums/defualts.enum";

export class AddUpdateNoteInput {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
  }
  empId?: number;
  noteId?: number;
  productId?: number;
  taskId?: number;
  reportId?: number;
  noteTxt?: string;
  isPrivate?: boolean;
}
