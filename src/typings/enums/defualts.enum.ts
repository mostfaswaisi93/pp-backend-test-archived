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

export enum RES_FLAG {
  OLD_NEW = 1,
  OLD_NEW_LANG = 2,
  EMP_DETAIL = 3,
  CHANGE_DETAIL = 4,
  HYPER_LINK = 5,
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
