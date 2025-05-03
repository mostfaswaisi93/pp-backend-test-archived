import { Schema, model } from "mongoose";
import { ICategoryQuestionOption } from "./category-option.interface";

const categoryOptionSchema = new Schema<ICategoryQuestionOption>(
  {
    id: { type: String },
    questionsId: { type: String },
    options: { type: String },
    noOfQuestions: { type: String },
    nextQuestionId: { type: Schema.Types.ObjectId },
    nextQuestionType: { type: String, required: true },
    status: { type: String, required: true, default: "ACTIVE" },
    createdBy: { type: String },
    createdOn: { type: String },
    modifiedBy: { type: String },
    modifiedOn: { type: String },
    catQuestionId: { type: Schema.Types.ObjectId },
    nextcatQuestionId: { type: String },
  },
  { timestamps: true }
);

export const CategoryQuestionOption = model<ICategoryQuestionOption>(
  "CategoryQuestionOption",
  categoryOptionSchema
);
