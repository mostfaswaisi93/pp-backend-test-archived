import { HttpException } from "../../helpers/exption";
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
  invalidResourceOwner: {
    message: "invalidResourceOwner",
    customCode: "IVRCO403 ",
    status: 403,
  },
  userExisted: {
    message: "userExisted",
    customCode: "UE409",
    status: 409,
  },

  uniqueEmail: {
    message: "uniqueEmail",
    customCode: "UEA409",
    status: 409,
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
  invalidAccessToken: {
    message: "invalidAccessToken",
    customCode: "IVAT401",
    status: 401,
  },

  forbiddenAccess: {
    message: "forbiddenAccess",
    customCode: "FBA403",
    status: 403,
  },
  invalidCode: {
    message: "invalidCode",
    customCode: "IVL422",
    status: 422,
  },
  expiredLink: {
    message: "expiredLink",
    customCode: "EXPL422",
    status: 422,
  },
  imgExtention: {
    message: "invalidImgExtention",
    customCode: "IIEX422",
    status: 422,
  },
  fileSize: {
    message: "fileTooLarge",
    customCode: "FTLG422",
    status: 422,
  },
  invalidFile: {
    message: "invalidFile",
    customCode: "IF422",
    status: 422,
  },
  productStatusProgress: {
    message: "productStatusProgress",
    customCode: "PPE422",
    status: 422,
  },
  productStatusComplete: {
    message: "productStatusComplete",
    customCode: "PCE422",
    status: 422,
  },

  productFunction: {
    "-1": {
      message: "productFunction.updateStatus",
      customCode: "PFUS422",
      status: 422,
    },
    "-2": {
      message: "productFunction.updateColor",
      customCode: "PFUC422",
      status: 422,
    },
    "-3": {
      message: "productFunction.updateData",
      customCode: "PFUD422",
      status: 422,
    },
    "-4": {
      message: "productFunction.deleteProduct",
      customCode: "PFDP422",
      status: 422,
    },
    "-5": {
      message: "productFunction.duplicateProduct",
      customCode: "PFDP422",
      status: 422,
    },
    "-6": {
      message: "productFunction.exportProduct",
      customCode: "PFEP422",
      status: 422,
    },
    "-7": {
      message: "productFunction.convertToTemplate",
      customCode: "PFCT422",
      status: 422,
    },
    "123": {
      message: "productFunction.addProduct",
      customCode: "PFAP422",
      status: 422,
    },
  },
  createUpdateProduct: {
    responsibleEmployee: {
      message: "createUpdateProduct.responsibleEmployee",
      customCode: "CURENF422",
      status: 422,
    },
    uniqueArabicName: {
      message: "createUpdateProduct.uniqueArabicName",
      customCode: "CUPUAN422",
      status: 422,
    },
    uniqueEnglishName: {
      message: "createUpdateProduct.uniqueEnglishName",
      customCode: "CUPUEN422",
      status: 422,
    },
    uniqueProductCode: {
      message: "createUpdateProduct.uniqueProductCode",
      customCode: "CUPUEN422",
      status: 422,
    },
    productStatus: {
      message: "createUpdateProduct.productStatus",
      customCode: "CUPPS422",
      status: 422,
    },
  },
  createUpdateTask: {
    taskNotFound: {
      message: "createUpdateTask.taskNotFound",
      customCode: "TNF404",
      status: 404,
    },
    lockedStatus: {
      message: "createUpdateTask.lockedStatus",
      customCode: "TULS422",
      status: 422,
    },
    predcessorSelect: {
      message: "createUpdateTask.predcessorSelect",
      customCode: "IVPRSE422",
      status: 422,
    },
    predcessorCycle: {
      message: "createUpdateTask.predcessorCycle",
      customCode: "IVPRCY422",
      status: 422,
    },

    predcessorProduct: {
      message: "createUpdateTask.predcessorProduct",
      customCode: "IVPPD422",
      status: 422,
    },
    fsDependancyType: {
      message: "createUpdateTask.fsDependancyType",
      customCode: "IVFSD422",
      status: 422,
    },
    fsDependancyDate: {
      message: "createUpdateTask.fsDependancyDate",
      customCode: "IVDED422",
      status: 422,
    },
    sfDependancyType: {
      message: "createUpdateTask.sfDependancyType",
      customCode: "IVSFSD422",
      status: 422,
    },
    sfDependancyDate: {
      message: "createUpdateTask.sfDependancyDate",
      customCode: "IVDSD422",
      status: 422,
    },
    ssDependancyType: {
      message: "createUpdateTask.ssDependancyType",
      customCode: "IVSSDT422",
      status: 422,
    },
    ssDependancyDate: {
      message: "createUpdateTask.ssDependancyDate",
      customCode: "IVSSDD422",
      status: 422,
    },
    ffDependancyType: {
      message: "createUpdateTask.ffDependancyType",
      customCode: "IVSFFDT422",
      status: 422,
    },
    ffDependancyDate: {
      message: "createUpdateTask.ffDependancyDate",
      customCode: "IVFFDED422",
      status: 422,
    },
    sameCurrentStatusValue: {
      message: "createUpdateTask.sameCurrentStatusValue",
      customCode: "SCSV",
      status: 422,
    },
  },
  taskDateCalc: {
    "123": {
      message: "productFunction.addProduct",
      customCode: "PFAP422",
      status: 422,
    },
  },
  directorate: {
    hasDirectoratesDependency: {
      message: "directorate.hasDirectoratesDependency",
      customCode: "IVDD422",
      status: 422,
    },
    hasHirarchyRolesDependency: {
      message: "directorate.hasHirarchyRolesDependency",
      customCode: "IVDHR422",
      status: 422,
    },
    hasProjectsDependency: {
      message: "directorate.hasProjectsDependency",
      customCode: "IVDP422",
      status: 422,
    },
    hasTemplatesDependency: {
      message: "directorate.hasTemplatesDependency",
      customCode: "IVDT422",
      status: 422,
    },
    hasTasksDependency: {
      message: "directorate.hasTasksDependency",
      customCode: "IVDPM422",
      status: 422,
    },
    hirarchyRolesHasEmployeesDependency: {
      message: "directorate.hirarchyRolesHasEmployeesDependency",
      customCode: "IVDHRE422",
      status: 422,
    },
  },
  moveTask: {
    taskNotFound: {
      message: "moveTask.taskNotFound",
      customCode: "MTTNF422",
      status: 422,
    },
    invalidOperation: {
      message: "moveTask.invalidOperation",
      customCode: "MTIVO422",
      status: 422,
    },
    parentDependent: {
      message: "moveTask.parentDependent",
      customCode: "MTPD422",
      status: 422,
    },
    parentDependonit: {
      message: "moveTask.parentDependonit",
      customCode: "MTPDOI422",
      status: 422,
    },
    invalidParent: {
      message: "moveTask.invalidParent",
      customCode: "MTIVPT422",
      status: 422,
    },
    assignParentChild: {
      message: "moveTask.assignParentChild",
      customCode: "MTAPC422",
      status: 422,
    },
  },
  updateTaskApproval: {
    invalidStatus: {
      message: "updateTaskApproval.invalidStatus",
      customCode: "UTAIVS422",
      status: 422,
    },
    needApprove: {
      message: "updateTaskApproval.needApprove",
      customCode: "UTANNA422",
      status: 422,
    },
    canApprove: {
      message: "updateTaskApproval.canApprove",
      customCode: "UTACA422",
      status: 422,
    },
  },
  updateTaskRatio: {
    parent: {
      message: "updateTaskRatio.parent",
      customCode: "UTRLO422",
      status: 422,
    },
    ambiguous: {
      message: "updateTaskApproval.ambiguous",
      customCode: "UTRAM422",
      status: 422,
    },
    missingMandatory: {
      message: "updateTaskApproval.missingMandatory",
      customCode: "UTRMM422",
      status: 422,
    },
    invalidStatus: {
      message: "updateTaskApproval.invalidStatus",
      customCode: "UTRIVS422",
      status: 422,
    },
  },
  deleteReportEscalation: {
    userReport: {
      message: "deleteReportEscalation.userReport",
      customCode: "DREUR422",
      status: 422,
    },
    userEscalation: {
      message: "deleteReportEscalation.userEscalation",
      customCode: "DREUE422",
      status: 422,
    },
    updateEscalationStatus: {
      message: "deleteReportEscalation.updateEscalationStatus",
      customCode: "DRECE422",
      status: 422,
    },
    redirected: {
      message: "deleteReportEscalation.redirected",
      customCode: "DRERR422",
      status: 422,
    },
  },
  createUpdateReportEscalation: {
    ownerUpdate: {
      message: "createUpdateReportEscalation.ownerUpdate",
      customCode: "CUREOU422",
      status: 422,
    },
    invalidTarget: {
      message: "createUpdateReportEscalation.invalidTarget",
      customCode: "CUREIT422",
      status: 422,
    },
  },
  addUpdateNote: {
    ownerUpdate: {
      message: "addUpdateNote.ownerUpdate",
      customCode: "AUNOU422",
      status: 422,
    },
    invalidInput: {
      message: "addUpdateNote.invalidInput",
      customCode: "AUNII422",
      status: 422,
    },
  },
  viewOwenNote: {
    message: "viewOwenNote",
    customCode: "CNTVON422",
    status: 422,
  },
  duplicateCode: {
    message: "duplicateCode",
    customCode: "DC",
    status: 422,
  },
  duplicateName: {
    message: "duplicateName",
    customCode: "DN",
    status: 422,
  },
  chart: {
    invalidAggregationType: {
      message: "invalidAggregationType",
      customCode: "IVAGT",
      status: 422,
    },
    invalidChartType: {
      message: "invalidChartType",
      customCode: "IVACT",
      status: 422,
    },
    invalidChartCategory: {
      message: "invalidChartCategory",
      customCode: "IVCUC",
      status: 422,
    },
  },
  statusAssignedToTask: {
    message: "statusAssignedToTask",
    customCode: "SATT",
    status: 422,
  },
  rolePermissions: {
    message: "roleNameExists",
    customCode: "RNE",
    status: 422,
  },
  wrongAuthenticationCode: {
    message: "wrongAuthenticationCode",
    customCode: "SATT",
    status: 422,
  },
  selectedRoleHasEmployees: {
    message: "roleNameHasEmployees",
    customCode: "RNHE",
    status: 422,
  },
  employeeCodeTaken: {
    message: "employeeCodeTaken",
    customCode: "ECT",
    status: 422,
  },

  UpdateStatusNote: {
    message: "UpdateStatusNote",
    customCode: "USN",
    status: 422,
  },

  clientIdNotFound: {
    message: "clientIdNotFound",
    customCode: "CINF",
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
    wrongPhoneExt: {
      message: "excelUsers.wrongPhoneExt",
      customCode: "WPE",
      status: 422,
    },
    wrongCountryCodeId: {
      message: "excelUsers.wrongCountryCodeId",
      customCode: "WCCI",
      status: 422,
    },
    wrongHirRoleCode: {
      message: "excelUsers.wrongHirRoleCode",
      customCode: "WHRC",
      status: 422,
    },
    wrongDirCode: {
      message: "excelUsers.wrongDirCode",
      customCode: "WDC",
      status: 422,
    },
  },
  fileNotFound: {
    message: "fileNotFound",
    customCode: "FNF",
    status: 422,
  },
  wrongJobTitleCode: {
    message: "wrongJobTitleCode",
    customCode: "WJTC",
    status: 422,
  },
  wrongDepartmentCode: {
    message: "wrongDepartmentCode",
    customCode: "WDC",
    status: 422,
  },

  wrongCountryCode: {
    message: "wrongCountryCode",
    customCode: "WDC",
    status: 422,
  },

  reportTemplate: {
    notAllowedToRemoveActive: {
      message: "reportTemplate.notAllowedToRemoveActive",
      customCode: "NATRA",
      status: 422,
    },
    notAllowedDeSelectActive: {
      message: "reportTemplate.notAllowedDeSelectActive",
      customCode: "NATDA",
      status: 422,
    },
    invalidExt: {
      message: "reportTemplate.invalidExt",
      customCode: "IE",
      status: 422,
    },
    FileAlreadyExists: {
      message: "reportTemplate.FileAlreadyExists",
      customCode: "FAE",
      status: 422,
    },
  },
};
