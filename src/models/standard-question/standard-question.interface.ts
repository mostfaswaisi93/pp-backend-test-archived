export interface IStandardQuestion {
  id: string;
  questionsId: string;
  questions?: string;
  stdType?: string;
  stdNextQuestionId?: string;
  skipQuestion: string;
  questionType: string;
  options?: object[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
