import { Document, Types } from "mongoose";

export interface ICategoryQuestionOption extends Document {
  id?: string;
  questionsId?: string;
  options?: string;
  noOfQuestions?: string;
  nextQuestionId?: Types.ObjectId;
  nextQuestionType: string;
  status?: string;
  createdBy?: string;
  createdOn?: string;
  modifiedBy?: string;
  modifiedOn?: string;
  catQuestionId?: Types.ObjectId;
  nextcatQuestionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
