import { Schema, model } from "mongoose";
import { IStandardQuestion } from "./standard-question.interface";

const standardQuestionSchema = new Schema<IStandardQuestion>(
  {
    id: { type: String, required: true },
    questionsId: { type: String, required: true },
    questions: { type: String },
    stdType: { type: String },
    stdNextQuestionId: { type: String },
    skipQuestion: { type: String, required: true },
    questionType: { type: String, required: true },
    options: [{ type: Object }],
    status: { type: String, required: true, default: "ACTIVE" },
  },
  { timestamps: true }
);

export const StandardQuestion = model<IStandardQuestion>(
  "StandardQuestion",
  standardQuestionSchema
);
