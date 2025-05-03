import dotenv from "dotenv";
import { CategoryQuestionOption } from "../models/category-option/category-option.model";

dotenv.config();

export const runCategoryQuestionOptionSeeder = async () => {
  const categoryQuestionOptionData = [
    {
      id: "OP0001",
      questionsId: "Q0001",
      options: "Option 1",
      noOfQuestions: "5",
      nextQuestionId: null,
      nextQuestionType: "MULTIPLE_CHOICE",
      status: "ACTIVE",
      createdBy: "SYSTEM ADMIN",
      createdOn: new Date().toISOString(),
      modifiedBy: null,
      modifiedOn: null,
      catQuestionId: null,
      nextcatQuestionId: "Q0002",
    },
    {
      id: "OP0002",
      questionsId: "Q0002",
      options: "Option 2",
      noOfQuestions: "3",
      nextQuestionId: null,
      nextQuestionType: "YES_NO",
      status: "ACTIVE",
      createdBy: "SYSTEM ADMIN",
      createdOn: new Date().toISOString(),
      modifiedBy: null,
      modifiedOn: null,
      catQuestionId: null,
      nextcatQuestionId: "Q0003",
    },
  ];

  try {
    await CategoryQuestionOption.insertMany(categoryQuestionOptionData);
    console.log("Category question option seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting category question option seed data:", error);
  }
};
