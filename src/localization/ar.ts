export const ar = {
  userNotFound: "المستخدم غير معرف",
  invalidLink: "رابط غير صحيح",
  expiredLink: "لم يعد الرابط صالحًا",
  wrongPasswordOrUSerName: "خطأ في اسم المستخدم أو كلمة المرور",
  userIsNotActive: "اسم المستخدم غير فعال",
  EmailAlreadyExsis: "البريد الإلكتروني موجود مسبقًا",
  productStatusProgress:
    "لا يمكن تعديل حالة المنتج إلى مخطط لتنفيذها عندما تكون نسبة الإنجاز لا تساوي صفر",
  productStatusComplete:
    "لا يمكن تحديد حالة المنتج كمنتهي إلا إذا كانت نسبة الإنجاز %100",
  productStatusPlanning:
    "لا يمكن تعديل حالة المنتج إلى مخطط لتنفيذها عندما تكون نسبة الإنجاز لا تساوي صفر",
  productFunction: {
    updateStatus: "مدير المشروع هو المخول بتغيير حالة المشروع",
    updateColor: "مدير المشروع هو المخول بتغيير لون المشروع",
    updateData: "مدير المشروع هو المخول بتعديل بيانات المشروع",
    deleteProduct: "مدير المشروع هو المخول بحذف المشروع",
    duplicateProduct: "مدير المشروع هو المخول بتكرار المشروع",
    exportProduct: "مدير المشروع هو المخول بتصدير المشروع",
    convertToTemplate: "مدير المشروع هو المخول بتحويل المشروع إلى قالب",
    addProduct: "أنت لا تملك صلاحية إضافة مشروع جديد",
  },
  statusAssignedToTask: "الحالة مستخدمة في مهمة",
  createUpdateProduct: {
    productCode: "الرمز (مطلوب)",
    productStatusId: "الحالة مطلوبة",
    productDirectorateId: "الإدارة المسؤولة مطلوبة",
    productAdminId: "المشرف المسؤول مطلوب",
    responsibleEmployee: "الموظف لا ينتمي للوحدة المختارة",
    startDate: "تاريخ البدء مطلوب",
    attributesTypeId: "الرجاء إدخال جميع أنواع الخصائص",
    uniqueArabicName: "الاسم بالعربي معرف مسبقًا",
    uniqueName: "الاسم معرف مسبقًا",
    uniqueEnglishName: "الاسم بالإنجليزي معرف مسبقًا",
    uniqueProductCode: "الرمز معرف مسبقًا",
    productStatus: "حالة المشروع الجديد مخطط لتنفيذه أو جاري العمل",
    directoratesPool: "Invalid Directorates Pool",
    employeesPool: "Invalid Employee Pool",
    invalidProgressRatio: "نسبة التقدم غير صالحة",
  },
  createUpdateTask: {
    lockedStatus: "حالة المشروع لا تسمح بأي تعديل",
    taskNotFound: "مهمة غير معرفة",
    predcessorSelect: "المهمة المعتمد عليها غير مقبولة",
    predcessorProduct: "المهمة والمهمة المعتمد عليها لا ينتميان لنفس المنتج",
    fsDependancyType: "تاريخ الانتهاء غير معرف للمهمة المعتمد عليها",
    fsDependancyDate:
      "تاريخ البدء يجب أن يكون بعد تاريخ الانتهاء للمهمة المعتمد عليها",
    sfDependancyType: "تاريخ البدء غير معرف للمهمة المعتمد عليها",
    sfDependancyDate:
      "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء للمهمة المعتمد عليها",
    ssDependancyType: "تاريخ البدء غير معرف للمهمة المعتمد عليها",
    ssDependancyDate:
      "تاريخ البدء يجب أن يكون بعد تاريخ البدء للمهمة المعتمد عليها",
    ffDependancyType: "تاريخ الانتهاء غير معرف للمهمة المعتمد عليها",
    ffDependancyDate:
      "تاريخ الإنهاء يجب أن يكون بعد تاريخ الانتهاء للمهمة المعتمد عليها",
    sameCurrentStatusValue: "القيمة الجديدة مشابهة للقيمة القديمة",
  },
  taskDateCalc: {
    invalidDuration: "المدة يجب أن تكون أكبر من 0",
  },
  directorate: {
    hasDirectoratesDependency:
      "الوحدة الإدارية مرتبطة بالوحدات الإدارية التالية",
    hasHirarchyRolesDependency:
      "الوحدة الإدارية مرتبطة بالمسميات الوظيفية التالية",
    hasProjectsDependency: "الوحدة الإدارية مرتبطة بالمشاريع التالية",
    hasTemplatesDependency: "الوحدة الإدارية مرتبطة بمهمات القوالب التالية",
    hasTasksDependency: "الوحدة الإدارية مرتبطة بمهام المشاريع التالية",
    hirarchyRolesHasEmployeesDependency:
      "لا يمكن إزالة المسمى الوظيفي لهذه الوحدة الإدارية",
  },
  moveTask: {
    taskNotFound: "مهمة غير معرفة",
    invalidParent: "مهمة الوالدين غير معرفة",
    invalidOperation: "عملية غير صحيحة",
    parentDependent:
      "عملية غير مقبولة نظرًا لوجود إعتمادية لاعتماد المهمة الهدف على مهام أخرى",
    parentDependonit:
      "عملية غير مقبولة نظرًا لاعتماد بعض المهام على المهمة الهدف",
    assignParentChild: "لا يمكن نقل الاب الى ابنه",
  },
  updateTaskApproval: {
    invalidStatus: "قيمة حالة غير صاحة",
    needApprove: "المهمة لا تتطلب إعتماد",
    canApprove: "لا يمكن إعتماد مهمة لم يتم تحديد نسبة الإنجاز لها",
  },
  updateTaskRatio: {
    parent: "لا يمكن التعديل إلا على أوراق المنتج",
    missingMandatory: "أحد الحقول الإجبارية مفقود",
    ambiguous: "يجب أن يمرر قيمة واحدة فقط",
    invalidStatus: "حالة غير صحيحة",
  },
  deleteReportEscalation: {
    userReport: "لا يمكنك حذف تقرير تم إنشاؤه من قبل مستخدم آخر",
    userEscalation: "لا يمكنك حذف تصعيد تم إنشاؤه من قبل مستخدم آخر",
    updateEscalationStatus: "لا يمكن حذف تصعيد محدث",
    redirected: "لا يمكنك حذف التقرير بعد إعادة توجيهه",
  },
  createUpdateReportEscalation: {
    ownerUpdate: "لا يمكنك التعديل على تقرير لمستخدم آخر",
    invalidTarget: "هدف غير صالح",
  },
  addUpdateNote: {
    ownerUpdate: "لا يمكنك التعديل على ملاحظة لمستخدم آخر",
    invalidInput: "مدخل غير صالح",
  },
  duplicateCode: "الرمز موجود بالفعل",
  duplicateName: "الاسم موجود بالفعل",
  viewOwenNote: "لا يمكنك تغيير حالة التعليق الخاص بك",
  roleNameExists: "اسم الدور موجود بالفعل، يرجى اختيار اسم آخر",
  wrongAuthenticationCode: "رمز المصادقة خاطئ",
  roleNameHasEmployees: "الدور المراد حذفه مرتبط بموظفين فعالين",
  employeeCodeTaken: "الرقم الوظيفي موجود",
  UpdateStatusNote: "خطأ اثناء تحديث ملاحظات تغيير الحالة",
  clientIdNotFound: "رقم الشركة الخاص بالمستخدم غير موجود.",
  excelUsers: {
    repetitiveDataInExcelsheet:
      "يوجد بيانات مكررة في ملف الاكسل الذي تم اختياره",
    noUsersFound: "الملف لا يحتوي على موظفين",
    emptyFile: "الملف فارغ",
    requiredFields: "يوجد حقول اجبارية داخل الملف بحاجة الى تعبئة",
    wrongEmployeeCodeFormat: "يجب ادخال رمز الموظف بشكل صحيح في كل الحقول",
    wrongEmployeeCodeLength: "يجب ان لا يزيد رمز الموظف عن 5 ارقام",
    wrongEmailFormat: "يجب ادخال البريد الالكتروني في كل الحقول بشكل صحيح",
    wrongMobileNumber: "يجب ادخال رقم الهاتف في كل الحقول بشكل صحيح",
    wrongPhoneExt: "يجب ادخال رمز الهاتف في كل الحقول بشكل صحيح",
    wrongCountryCodeId: "يجب ادخال رمز الدولة في كل الحقول بشكل صحيح",
    wrongHirRoleCode: "يجب ادخال رقم المسمى الوظيفي في كل الحقول بشكل صحيح",
    wrongDirCode: "يجب ادخال رقم القسم في كل الحقول بشكل صحيح",
  },
  fileNotFound: "الملف غير موجود",
  reportTemplate: {
    notAllowedToRemoveActive: "لا يمكن حذف نموذج فعال",
    notAllowedDeSelectActive: "لا يمكن الغاء تفعيل نفس النموذج",
    invalidExt: "امتداد النموذج يجب أن يكون html أو htm",
    FileAlreadyExists: "النموذج موجود بالفعل",
  },
  wrongJobTitleCode: "رمز المسمى الوظيفي غير موجود",
  wrongDepartmentCode: "رمز القسم غير موجود",
  wrongCountryCode: "رمز الدولة غير موجود",
};
