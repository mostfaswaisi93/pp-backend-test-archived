import { Schema, model } from "mongoose";
import { IPricebook } from "./pricebook.interface";

// Renamed to loginId for clarity (login identifier)
const pricebookSchema = new Schema<IPricebook>(
  {
    userId: { type: String },  // Improved naming for clarity
    proId: { type: String },
    serviceId: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    
    // Renamed to isLeadCostApplied for better clarity (boolean indicating if lead cost is applied)
    isLeadCostApplied: { type: Boolean },  // Improved naming for clarity
    leadCost: { type: Number, default: 0 },

    // Renamed to isTruckOrderCostApplied for better clarity (boolean indicating if truck order cost is applied)
    isTruckOrderCostApplied: { type: Boolean },  // Improved naming for clarity
    truckOrderCost: { type: Number },

    // Renamed to inventoryItems to indicate it's an array of items
    inventoryItems: [{ type: Object }],  // Improved naming for clarity
    laborRate: { type: Number, default: 0 },
    numberHours: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    standard: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    member: { type: Number, default: 0 },
    standardPercent: { type: Number, default: 0 },
    valuePercent: { type: Number, default: 0 },
    memberPercent: { type: Number, default: 0 },
    totalMaterialCost: { type: Number, default: 0 },

    // Renamed to imageUrls to indicate it's a list of image URLs
    imageUrls: [{ type: String }],  // Improved naming for clarity
    
    // Renamed to documentFilename for better understanding that it's the filename of the document
    documentFilename: { type: String },  // Improved naming for clarity
    
    documentName: { type: String },
    serviceDescription: { type: String },
    installationDescription: { type: String },
    
    // Renamed to serviceStatus for clarity, since it refers to the service status
    serviceStatus: { type: String, default: "ACTIVE", required: true },  // Improved naming for clarity
    
    // Renamed to qrImageUrl to make it clear that it contains the URL of the QR image
    qrImageUrl: { type: String },  // Improved naming for clarity

    // Renamed to createdAt and updatedAt for consistency with common practice for timestamps
    createdAt: { type: String },  // Improved naming for consistency
    createdBy: { type: String },
    updatedAt: { type: String },  // Improved naming for consistency
    updatedBy: { type: String },

    // Renamed to createdByEmail and updatedByEmail for consistency and clarity
    createdByEmail: { type: String },  // Improved naming for consistency
    updatedByEmail: { type: String },  // Improved naming for consistency
    
    updatedByImage: { type: String },
  },
  { timestamps: true }
);

// Exporting the model with the new schema
export const Pricebook = model<IPricebook>("Pricebook", pricebookSchema);
