export enum DEFULAT_VARIABLES {
  password = "123456789",
  jwtExpireIn = "15min",
  jwtRefreshExpireIn = "30day",
  recoveCodeExpireIn = 5, // hours
  generalNotificationId = 18,
  colorPaletteSize = 26,
}
export enum DEFAULT_FORMATTS {
  dataBaseDateFormat = "%d/%m/%Y",
}
export enum RECOVER_TOKEN_TYPE {
  setPassword = 2,
  forgetPassword = 1,
}
export enum RolesEnum {}
export enum LANG_LIST {
  "Ar" = "ar",
  "En" = "en",
}
export enum LANGUAGE {
  "ar",
  "en",
}
export const LANGUAGE_ARRAY = ["ar", "en"];
export enum TASK_STATUS {
  "Confirmed" = 0,
  "Approved" = 1,
  "Rejected" = 2,
  "Need Approval" = 3,
}
export enum PRODCUT_ACTION_TYPE {
  needApproval = 3,
  rejected = 2,
  approved = 1,
  default = 0,
}
export enum PRODUCT_ACTION_FLOW_TYPES {
  taskOwner = 1,
  productOwner = 2,
  custom = 3,
}

export enum PRODUCT_FUNCTION {
  updateStatus = -1,
  updateColor = -2,
  updateData = -3,
  deleteProduct = -4,
  duplicateProduct = -5,
  exportProduct = -6,
  convertToTemplate = -7,
  addProduct = 123,
}
export enum PRODUCT_STATUS {
  planned = 1,
  inProgress = 2,
  Delayed = 3,
  Canceled = 4,
  completed = 6,
}

export enum RECURRING_TYPE {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4,
}
export const WEEK_DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thuersday",
  "friday",
  "saturday",
];
export enum WEEKLY_DAYS {
  "weeklySunday" = 0,
  "weeklyMonday",
  "weeklyTuesday",
  "weeklyWednesday",
  "weeklyThursday",
  "weeklyFriday",
  "weeklySaturday",
}

export enum DATE_CALCULATION_FUNCTION {
  startDate = 1,
  endDate = 2,
  duraion = 3,
}
export enum RECURRING_CALCULATION_FUNCTION {
  startDate = 1,
  endDate = 2,
  occurrence = 3,
}
export enum REPORT_TYPE {
  escalation = 1,
  report = 2,
}
export enum REPORT_SEARCH_TYPE {
  incoming = 2,
  outgoing = 1,
}
export enum DEFAULT_IDS {
  statusGroupId = 100321,
}
export enum PRODUCT_ACTIONS {
  Escalation = 1,
  Report = 2,
  Approval = 3,
}

export enum ATTACHMENT_TYPES {
  Report = 1,
  Note = 2,
  Project = 3,
  Image = 4,
}

export enum REPORT_ESCALACTION_TARGET_TYPES {
  Auto = 1,
  Selective = 2,
}
export enum PROJECT_COPY_TYPE {
  "Template" = 1,
  "Board" = 2,
  "MS_Project" = 3,
  "Excel_File" = 4,
}
export enum INBOX_TYPES {
  "Escalation" = 1,
  "Report" = 2,
  "Board" = 3,
  "Task" = 4,
}

export enum ACTIVITY_LOG_TYPE {
  Assign_Dep = 5,
  Assign_Emp = 6,
  Board_Status = 3,
  Call = 7,
  Update_Escalation_Status = 20,
  Delete_Task = 23,
  Edit_Board = 10,
  Edit_Board_Note = 103,
  Edit_Escalation_Note = 105,
  Edit_Report_Note = 106,
  Edit_Task = 13,
  Edit_Task_Note = 104,
  Email = 9,
  Forward_Report = 18,
  New_Board = 11,
  New_Board_Note = 102,
  New_Escalation = 16,
  New_Escalation_Note = 22,
  New_Report = 15,
  New_Report_Note = 19,
  New_Task = 14,
  New_Task_Note = 101,
  Remove_Escalation = 111,
  Remove_Report = 112,
  SMS = 8,
  Task_Approval = 2,
  Task_Duration = 12,
  Task_Progress = 1,
}
export enum RES_FLAG {
  OLD_NEW = 1,
  OLD_NEW_LANG = 2,
  EMP_DETAIL = 3,
  CHANGE_DETAIL = 4,
  HYPER_LINK = 5,
}
export enum ACTIVITY_LOG_RES_FLAG {
  Board_Status = RES_FLAG.OLD_NEW_LANG,
  Task_Duration = RES_FLAG.OLD_NEW,
  Task_Progress = RES_FLAG.OLD_NEW_LANG,
  Task_Approval = RES_FLAG.OLD_NEW_LANG,
  Update_Escalation_Status = RES_FLAG.OLD_NEW_LANG,

  Assign_Dep = RES_FLAG.EMP_DETAIL,
  Assign_Emp = RES_FLAG.EMP_DETAIL,
  Edit_Task = RES_FLAG.CHANGE_DETAIL,
  Edit_Board = RES_FLAG.CHANGE_DETAIL,

  Call = RES_FLAG.HYPER_LINK,
  Delete_Task = RES_FLAG.HYPER_LINK,
  Edit_Board_Note = RES_FLAG.HYPER_LINK,
  Edit_Escalation_Note = RES_FLAG.HYPER_LINK,
  Edit_Report_Note = RES_FLAG.HYPER_LINK,
  Edit_Task_Note = RES_FLAG.HYPER_LINK,
  Email = RES_FLAG.HYPER_LINK,
  Forward_Report = RES_FLAG.HYPER_LINK,
  New_Board = RES_FLAG.HYPER_LINK,
  New_Board_Note = RES_FLAG.HYPER_LINK,
  New_Escalation = RES_FLAG.HYPER_LINK,
  New_Escalation_Note = RES_FLAG.HYPER_LINK,
  New_Report = RES_FLAG.HYPER_LINK,
  New_Report_Note = RES_FLAG.HYPER_LINK,
  New_Task = RES_FLAG.HYPER_LINK,
  New_Task_Note = RES_FLAG.HYPER_LINK,
  Remove_Escalation = RES_FLAG.HYPER_LINK,
  Remove_Report = RES_FLAG.HYPER_LINK,
  SMS = RES_FLAG.HYPER_LINK,
}
export enum ACTIVITY_LOG_REF_TYPE {
  TASK = 1,
  REPORT = 2,
  NOTE = 3,
}

export enum NOTIFICATION_TYPE {
  GENERAL_NOTIFICATION = DEFULAT_VARIABLES.generalNotificationId,
  ADD_NEW_TASK = 11,
  ASSIGN_DEPARTMENT = 10,
  ASSIGN_EMPLOYEE = 9,
  REMOVE_EMPLOYEE = 31,
  TASK_APPROVAL = 16,
  BOARD_STATUS = 3,
  NEW_REPORT_TASK = 25,
  NEW_REPORT_BOARD = 5,
  NEW_ESCALATION_TASK = 14,
  NEW_ESCALATION_BOARD = 6,
  REDIRECT_REPORT_BOARD = 19,
  REDIRECT_REPORT_TASK = 28,
  Update_Escalation_Status = 22,
  NOTE_REPORT_TASK = 26,
  NOTE_REPORT_BOARD = 20,
  NOTE_TASK = 17,
  NOTE_ESCALATION_TASK = 27,
  NOTE_ESCALATION_BOARD = 24,
  NEW_BOARD_NOTE = 30,
  EDIT_TASK_PROGRESS = 15,
  EDIT_TASK_INFO = 12,
  DELETE_TASK = 13,
}
export enum CHART_TYPE {
  PIE = 1,
  BAR,
  COLUMN,
  STACKED_COLUMN,
  STACKED_BAR = 9,
  STACKED_AREA = 6,
  AREA = 7,
  LINE = 8,
  PIVOT_TABLE = 10,
  QUERY_TILE = 11,
}
export enum SORT_TYPE {
  ASC = 0,
  DESC = 1,
}
export enum AGGREGATION_TYPE {
  SUM = 1,
  AVG,
  COUNT,
  MIN,
  MAX,
}
export enum LOGIC_OPERATORS {
  AND = 1,
  OR,
}
export enum ATRRIBUTE_TYPE {
  BOOLEAN = 5,
  DATE = 1,
  STRING = 2,
  NUMBER = 3,
}

export enum ARITHMETIC_OPERATORS {
  EQUAL = 1,
  GRATER_THEN,
  LESS_THEN,
  GRATER_THEN_OR_EQUAL,
  LESS_THEN_OR_EQUAL,
  NOT_EQUAL,
  IN,
  NOT_IN,
}
export enum RECURRING_POSITION {
  first = 1,
  second,
  third,
  fourth,
  last,
}
export const COLOR_PALETTE = [
  "rgb(100, 124, 138)",

  "rgb(63, 81, 181)",

  "rgb(0, 184, 98)",

  "rgb(175, 223, 10)",

  "rgb(167, 182, 26)",

  "rgb(243, 229, 98)",

  "rgb(255, 152, 0)",

  "rgb(255, 87, 34)",

  "rgb(100, 124, 138)",

  "rgb(63, 81, 181)",

  "rgb(33, 150, 243)",

  "rgb(0, 184, 98)",

  "rgb(167, 182, 26)",

  "rgb(243, 229, 98)",

  "rgb(255, 87, 34)",

  "rgb(255, 69, 20)",
];
export enum FILE_TYPES {
  PDF = 1,
  MS = 2,
}

export enum EXCEL_VALIDATION {
  NO_DATA_FOUND = 1,
  MISSING_DATA = 2,
}
export enum CURRENT_DATE_OPERATION {
  PLUS = 1,
  MINUS,
}

export const enum ESCALATION_STATUS {
  New = 1,
  InProgress,
  Resolved,
  Closed,
}

export const enum ReadStatus {
  unRead = 1,
  read,
  all,
}

export enum DeviceType {
  phone = 1,
  desktop = 2,
}
