import { Schema, model } from "mongoose";
import { ICategoryQuestion } from "./category-question.interface";

const categoryQuestionSchema = new Schema<ICategoryQuestion>(
  {
    id: { type: String },
    questionsId: { type: String },
    questions: { type: String, required: true },
    optionType: { type: String, required: true },
    questionType: { type: String },
    noOfOptions: { type: String },
    nextQuestionType: { type: String },
    nextQuestionId: { type: String },
    cat_code: { type: String, required: true },
    status: { type: String, required: true, default: "ACTIVE" },
    subcat_code: { type: String, required: true },
    serviceName: { type: String },
    question_id: { type: String },
    new_field: { type: String },
    subCategoryId: { type: Schema.Types.ObjectId },
    options: [{ type: Object }],
    prevAnswerQuestionId: [Schema.Types.Mixed],
    isFirst: { type: String },
  },
  { timestamps: true }
);

export const CategoryQuestion = model<ICategoryQuestion>(
  "CategoryQuestion",
  categoryQuestionSchema
);
