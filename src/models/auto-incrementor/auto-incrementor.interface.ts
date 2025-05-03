import { Document } from "mongoose";

export interface IAutoIncrementor extends Document {
  type: string;
  PR?: number;
  ST?: number;
  WO?: number;
  VD?: number;
  ES?: number;
  PB?: number;
  IN?: number;
  LO?: number;
  CU?: number;
  LD?: number;
  PM?: number;
  EQ?: number;
  PO?: number;
  JB?: number;
  SC?: number;
  BP?: number;
  TSL?: number;
  INV?: number;
  PRW?: number;
  POW?: number;
  CSR?: number;
  RAP?: number;
  DBL?: number;
  GQL?: number;
  PMT?: number;
  RFT?: number;
  RFN?: number;
  NON?: number;
  SM?: number;
  WTO?: number;
  ORD?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
