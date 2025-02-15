export const en = {
  userNotFound: "User Not Found",
  invalidLink: "Invalid Link",
  expiredLink: "Link is no Longer Valid",
  wrongPasswordOrUSerName: "Wrong Username or password",
  userIsNotActive: "User is not active",
  EmailAlreadyExsis: "Email already exsist",
  productStatusProgress:
    "Product Status Can not be set to Planned When the Progress is not 0",
  productStatusComplete:
    "Product Status Can not be Set to Ended While the Progress Is Not 100%",
  productStatusPlanning:
    "Product Status Can not be set to Planned When the Progress is not 0",
  productFunction: {
    updateStatus: "مدير المشروع هو المخول بتغيير حالة المشروع",
    updateColor: "مدير المشروع هو المخول بتغيير لون المشروع",
    updateData: "مدير المشروع هو المخول بتعديل بيانات المشروع",
    deleteProduct: "مدير المشروع هو المخول بحذف المشروع",
    duplicateProduct: "مدير المشروع هو المخول بتكرارالمشروع",
    exportProduct: "مدير المشروع هو المخول بتصدير المشروع",
    convertToTemplate: "مدير المشروع هو المخول بتحويل المشروع الى قالب",
    addProduct: "انت لا تملك صلاحية اضافة مشروع جديد",
  },
  createUpdateProduct: {
    productCode: "Code Is Required",
    productStatusId: "Status is required",
    productDirectorateId: "Directorate is reuired",
    productAdminId: "Responsible Employee is Required",
    responsibleEmployee:
      "The Employee Doesn't belong to the selected Directorate",
    startDate: "Please Enter Start Date",
    attributesTypeId: "Please enter all types of attributes",
    uniqueArabicName: "Arabic Name Already Defined",
    uniqueName: "Board Name Already Definedالاسم معرف مسبقا",
    uniqueEnglishName: "English Name Already Defined",
    uniqueProductCode: "Board Code Already Defined",
    productStatus: "New Porject Status Must be Planned or In Progress",
    directoratesPool: "Invalid Directorates Pool",
    employeesPool: "Invalid Employee Pool",
  },
  statusAssignedToTask: "status assigend to task",
  createUpdateTask: {
    lockedStatus: "Project Status Prevent any opertation",
    taskNotFound: "Task not found",
    predcessorSelect: "Invalid  Predcessor  Selected",
    predcessorCycle: "Tasks can't depend on each other  Predcessor  Cycle",
    predcessorProduct: "Task and Dependent Task are not in the same prodcut",
    fsDependancyType: "Start  date is Not Defined for the dependent Task",
    fsDependancyDate: "Start Date must be after dependent Task End Date",
    sfDependancyType: "End date is Not Defined for the dependent Task",
    sfDependancyDate: "End Date must be after dependent Task Start Date",
    ssDependancyType: "Start date is Not Defined for the dependent Task",
    ssDependancyDate: "Start Date must be after dependent Task Start Date",
    ffDependancyType: "End  date is Not Defined for the dependent Task",
    ffDependancyDate: "End Date must be after dependent Task End Date",
    sameCurrentStatusValue: "The new value is the same as the old value",
  },
  taskDateCalc: {
    invalidDuration: "Duration Must Be Greater Than 0",
  },
  directorate: {
    hasDirectoratesDependency:
      "Directorate has relation with the below Directorates",
    hasHirarchyRolesDependency:
      "Directorate has relation with the below Hirarchy Roles",
    hasProjectsDependency: "Directorate has relation with the below Projects",
    hasTemplatesDependency:
      "Directorate has relation with the below Template Processes",
    hasTasksDependency:
      "Directorate has relation with the below Project Processes",
    hirarchyRolesHasEmployeesDependency:
      "Cannot delete some hirarchy roles of this directorate because it has a relation with some employee(s)",
  },
  moveTask: {
    taskNotFound: "Invalid Task",
    invalidParent: "parent task not found",
    invalidOperation: "Invalid Operation",
    parentDependent: "Invalid Operatio Parent depends on other task",
    parentDependonit:
      "Invalid Operation Other Tasks depends on the target task",
    assignParentChild: "A parent cannot be passe it on to his child",
  },
  updateTaskApproval: {
    invalidStatus: "Invalid Status Sent",
    needApprove: "The task does not require approval",
    canApprove: "Can't Confirm Task Without Specifying Progress Ratio",
  },
  updateTaskRatio: {
    parent: "Update Only Allowed Only on Product Leafs",
    missingMandatory: "Msiiding Mandatory Field",
    ambiguous: "One Value can be passed",
    invalidStatus: "invalid status",
  },
  deleteReportEscalation: {
    userReport: "you can't delete report created by another user",
    userEscalation: "you can't delete ticket created by another user",
    updateEscalationStatus: "Updated Ticket Can't be Remove",
    redirected: "Redirected Report Can't be Remove",
  },
  createUpdateReportEscalation: {
    ownerUpdate: "ا يمكنك التعديل على تقرير لمستخدم اخر",
    invalidTarget: "invalid target",
  },
  addUpdateNote: {
    ownerUpdate: "can't edit other user note",
    invalidInput: "invalid input",
  },
  duplicateCode: "Code Already Exists",
  duplicateName: "Name Already Exists",
  viewOwenNote: "can't mark your owen comment as read/unread",
  roleNameExists: "Role name is already exists, please write another name.",
  wrongAuthenticationCode: "Wrong authentication code.",
  roleNameHasEmployees: "The selected role is associated with active employees",
  employeeCodeTaken: "Employee code exist",
  UpdateStatusNote: "Error during update report status note",
  clientIdNotFound: "Your client id dose not exist",
  excelUsers: {
    repetitiveDataInExcelsheet: "Repetitive data in selected excel sheet.",
    noUsersFound: "The file does not contain any employees.",
    emptyFile: "The selected file is empty.",
    requiredFields:
      "There are required fields inside the file that need to be filled.",
    wrongEmployeeCodeFormat:
      "The employee number must be entered correctly in all fields",
    wrongEmployeeCodeLength:
      "The employee code should be less than or equal 5 digits in all fields",
    wrongEmailFormat: "The email must be entered correctly in all fields",
    wrongMobileNumber:
      "The mobile number must be entered correctly in all fields",
    wrongPhoneExt: "The phone EXT must be entered correctly in all fields",
    wrongCountryCodeId:
      "The country code must be entered correctly in all fields",
    wrongHirRoleCode:
      "The job title code must be entered correctly in all fields",
    wrongDirCode: "The department code must be entered correctly in all fields",
  },
  wrongJobTitleCode: "Job title code dose not exist",
  wrongDepartmentCode: "Department code dose not exist",
  wrongCountryCode: "Country code dose not exist",
  fileNotFound: "File not found.",
  reportTemplate: {
    notAllowedToRemoveActive: "Not allowed to remove active template.",
    notAllowedDeSelectActive: "Not allowed to deactivate the same template.",
    invalidExt: "File extension must be html or htm",
    FileAlreadyExists: "File is already exists",
  },
};
