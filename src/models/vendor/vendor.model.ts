import { Schema, model } from "mongoose";
import { IVendor } from "./vendor.interface";

const vendorSchema = new Schema<IVendor>(
  {
    proId: { type: String },
    userId: { type: String },
    vendorId: { type: String },
    vendorName: { type: String, required: true }, // التأكد من أن اسم المورد مطلوب
    taxIdOrEIN: { type: String },
    representativeName: { type: String }, // تغيير الاسم ليكون أكثر وضوحًا
    eligible1099: { type: Boolean, default: false }, // تحديد القيمة الافتراضية
    vendorCategory: { type: String },
    representativeEmail: { type: String, lowercase: true, trim: true },
    accountNumber: { type: String },
    phoneNumber: { type: String },
    extension: { type: String }, // تغيير الاسم ليكون أكثر وضوحًا
    streetAddress: { type: String },
    unit: { type: String },
    state: { type: String },
    city: { type: String },
    zipcode: { type: String }, // توحيد الاسم مع باقي الملفات
    specialNotes: { type: String },
    searchByValues: { type: String },
    searchQuery: { type: String }, // تعديل الاسم ليكون أكثر دقة
    createdBy: { type: String },
    updatedByImage: { type: String },
    updatedByName: { type: String },
    updatedByEmail: { type: String },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }, // تقييد القيم المحتملة
  },
  { timestamps: true } // يحفظ createdAt و updatedAt تلقائيًا
);

export const Vendor = model<IVendor>("Vendor", vendorSchema);
