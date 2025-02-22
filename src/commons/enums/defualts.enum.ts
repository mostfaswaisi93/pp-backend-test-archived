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
  forgetPassword = 1,
  setPassword = 2,
}

export enum LANG_LIST {
  "Ar" = "ar",
  "En" = "en",
}

export enum LANGUAGE {
  "ar",
  "en",
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

export enum EXCEL_VALIDATION {
  NO_DATA_FOUND = 1,
  MISSING_DATA = 2,
}
