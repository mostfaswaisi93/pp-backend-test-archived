export interface IVendor {
  _id: string;
  proId?: string;
  userId?: string;
  vendorId?: string;
  vendorName?: string;
  taxIdOrEIN?: string;
  representativeName?: string; // accountRepName (تم تعديله ليكون أكثر وضوحًا)
  eligible1099: boolean; // جعله إلزاميًا بناءً على أهميته الضريبية
  vendorCategory?: string;
  representativeEmail?: string; // repEmailAddress (تم تعديله ليكون أكثر وضوحًا)
  accountNumber?: string;
  phoneNumber?: string;
  extension?: string; // extensionNumber (تم اختصاره)
  streetAddress?: string;
  unit?: string;
  state?: string;
  city?: string;
  zipcode?: string; // تعديل الاسم ليتناسق مع باقي الملفات
  specialNotes?: string;
  searchByValues?: string;
  searchQuery?: string; // searchBox (تم تعديله ليكون أكثر دقة)
  createdOn?: Date | string;
  createdBy?: string;
  updatedByImage?: string;
  updatedByName?: string;
  updatedByEmail?: string;
  status: string; // جعله إلزاميًا لتحديد حالة البائع بشكل واضح
}
