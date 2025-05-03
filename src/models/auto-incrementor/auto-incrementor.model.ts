import { Schema, model } from "mongoose";
import { IAutoIncrementor } from "./auto-incrementor.interface";

const autoIncrementorSchema = new Schema<IAutoIncrementor>(
  {
    type: { type: String, required: true },
    PR: { type: Number },
    ST: { type: Number },
    WO: { type: Number },
    VD: { type: Number },
    ES: { type: Number },
    PB: { type: Number },
    IN: { type: Number },
    LO: { type: Number },
    CU: { type: Number },
    LD: { type: Number },
    PM: { type: Number },
    EQ: { type: Number },
    PO: { type: Number },
    JB: { type: Number },
    SC: { type: Number },
    BP: { type: Number },
    TSL: { type: Number },
    INV: { type: Number },
    PRW: { type: Number },
    POW: { type: Number },
    CSR: { type: Number },
    RAP: { type: Number },
    DBL: { type: Number },
    GQL: { type: Number },
    PMT: { type: Number },
    RFT: { type: Number },
    RFN: { type: Number },
    NON: { type: Number },
    SM: { type: Number },
    WTO: { type: Number },
    ORD: { type: Number },
  },
  { timestamps: true }
);

export const AutoIncrementor = model<IAutoIncrementor>(
  "AutoIncrementor",
  autoIncrementorSchema
);
