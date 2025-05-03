import mongoose, { Document } from "mongoose";

export interface IReportPro extends Document {
  reportNumber?: string;
  workOrderNumber?: string;
  workOrederMainId?: mongoose.Types.ObjectId;
  projectName?: string;
  projectDescription?: string;
  reviewComments?: string;
  isNeverShowedUp?: boolean;
  isShowedUpTooLate?: boolean;
  isAbusiveBehavior?: boolean;
  isDoNotLookProfessional?: boolean;
  isOtherReason?: boolean;
  attachments?: object[];
  proId?: string;
  proMainId?: mongoose.Types.ObjectId;
  proEmailId?: string;
  proName?: string;
  customerName?: string;
  customerId?: string;
  customerEmailId?: string;
  customerMainId?: mongoose.Types.ObjectId;
  emailId?: string;
  date?: string;
  proReviewComments?: string;
  status?: string;
  createdOn?: string;
}