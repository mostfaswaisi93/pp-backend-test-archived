import { Schema, model } from "mongoose";
import { IStandardQuestionOption } from "./standard-option.interface";

const standardOptionSchema = new Schema<IStandardQuestionOption>(
  {
    id: { type: String },
    questionsId: { type: String, required: true },
    options: { type: String },
    noOfQuestions: { type: String },
    nextQuestionId: { type: String },
    nextStdQuestionId: { type: String },
    nextQuestionType: { type: String, required: true },
    status: { type: String, required: true, default: "ACTIVE" },
  },
  { timestamps: true }
);

export const StandardQuestionOption = model<IStandardQuestionOption>(
  "StandardQuestionOption",
  standardOptionSchema
);
