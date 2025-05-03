export interface IStandardQuestionOption {
  id?: string;
  questionsId: string;
  options?: string;
  noOfQuestions?: string;
  nextQuestionId?: string;
  nextStdQuestionId?: string;
  nextQuestionType: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
