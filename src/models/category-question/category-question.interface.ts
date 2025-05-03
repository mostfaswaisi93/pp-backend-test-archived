import { Document, Types } from "mongoose";

export interface ICategoryQuestion extends Document {
  id?: string;
  questionsId?: string;
  questions: string;
  optionType: string;
  questionType?: string;
  noOfOptions?: string;
  nextQuestionType?: string;
  nextQuestionId?: string;
  cat_code: string;
  status?: string;
  subcat_code: string;
  serviceName?: string;
  question_id?: string;
  new_field?: string;
  subCategoryId?: Types.ObjectId;
  options?: object[];
  prevAnswerQuestionId?: any[];
  isFirst?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
