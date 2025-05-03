import dotenv from "dotenv";
import { CategoryQuestion } from "../models/category-question/category-question.model";

dotenv.config();

export const runCategoryQuestionSeeder = async () => {
  const categoryQuestionData = [
    {
      questionsId: "QID001",
      questions: "What type of electronics are you looking for?",
      optionType: "single",
      questionType: "category",
      noOfOptions: "3",
      nextQuestionType: "subcategory",
      nextQuestionId: "QID002",
      cat_code: "EL0001",
      status: "ACTIVE",
      subcat_code: "EL01",
      serviceName: "ElectronicsService",
      question_id: "Q001",
      new_field: "example",
      subCategoryId: null,
      options: [
        { label: "Mobile Phones", value: "mobile" },
        { label: "Laptops", value: "laptop" },
        { label: "Cameras", value: "camera" },
      ],
      prevAnswerQuestionId: [],
      isFirst: "true",
    },
    {
      questionsId: "QID003",
      questions: "What type of clothing do you prefer?",
      optionType: "multiple",
      questionType: "category",
      noOfOptions: "2",
      nextQuestionType: "subcategory",
      nextQuestionId: "QID004",
      cat_code: "CL0001",
      status: "ACTIVE",
      subcat_code: "CL01",
      serviceName: "ClothingService",
      question_id: "Q002",
      new_field: "example2",
      subCategoryId: null,
      options: [
        { label: "Men", value: "men" },
        { label: "Women", value: "women" },
      ],
      prevAnswerQuestionId: [],
      isFirst: "true",
    },
  ];

  try {
    await CategoryQuestion.insertMany(categoryQuestionData);
    console.log("Category question seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting category question seed data:", error);
  }
};
