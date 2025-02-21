import { HttpException } from "../../helpers/exception";

export const exceptionMap = {
  serverError: {
    message: "serverError",
    customCode: "F500",
    status: 500,
  } as HttpException,

  validationError: {
    message: "validationError",
    customCode: "VE400",
    status: 400,
  },

  userNotFound: {
    message: "userNotFound",
    customCode: "U404",
    status: 404,
  },

  resourceNotFound: {
    message: "resourceNotFound",
    customCode: "RNF404",
    status: 404,
  },

  EmailAlreadyExsis: {
    message: "EmailAlreadyExsis",
    customCode: "UEA409",
    status: 409,
  },

  wrongPasswordOrUSerName: {
    message: "wrongPasswordOrUSerName",
    customCode: "WUPU422",
    status: 422,
  },

  userIsNotActive: {
    message: "userIsNotActive",
    customCode: "UNA422",
    status: 422,
  },

  invalidLanguage: {
    message: "invalidLanguage",
    customCode: "INL400",
    status: 400,
  },

  invalidInput: {
    message: "invalidInput",
    customCode: "INI400",
    status: 400,
  },

  expiredLink: {
    message: "expiredLink",
    customCode: "EXPL422",
    status: 422,
  },

  fileSize: {
    message: "fileTooLarge",
    customCode: "FTLG422",
    status: 422,
  },

  rolePermissions: {
    message: "roleNameExists",
    customCode: "RNE",
    status: 422,
  },

  excelValidations: {
    noUsersFound: {
      message: "excelUsers.noUsersFound",
      customCode: "NUF",
      status: 422,
    },
    repetitiveDataInExcelsheet: {
      message: "excelUsers.repetitiveDataInExcelsheet",
      customCode: "RDIES",
      status: 422,
    },
    emptyFile: {
      message: "excelUsers.emptyFile",
      customCode: "EF",
      status: 422,
    },
    requiredFields: {
      message: "excelUsers.requiredFields",
      customCode: "RF",
      status: 422,
    },
    wrongEmailFormat: {
      message: "excelUsers.wrongEmailFormat",
      customCode: "WEF",
      status: 422,
    },
    wrongMobileNumber: {
      message: "excelUsers.wrongMobileNumber",
      customCode: "WMN",
      status: 422,
    },
    wrongEmployeeCodeFormat: {
      message: "excelUsers.wrongEmployeeCodeFormat",
      customCode: "WECF",
      status: 422,
    },
    wrongEmployeeCodeLength: {
      message: "excelUsers.wrongEmployeeCodeLength",
      customCode: "WECL",
      status: 422,
    },
  },
};
