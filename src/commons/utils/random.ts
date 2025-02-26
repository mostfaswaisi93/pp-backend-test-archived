import { randomBytes } from "crypto";

export const getRandomNumber = (length: number): string => {
  length = length > 10 ? 10 : length;
  if (process.env.ENVIRONMENT == "development") return "000001";
  return Math.random()
    .toString()
    .slice(2, length + 2);
};
export const getRandomNumberV1 = (length: number): string => {
  length = length > 10 ? 10 : length;
  return Math.random()
    .toString()
    .slice(2, length + 2);
};
export const getRandomToken = (): string => {
  return randomBytes(32).toString("hex");
};

export const translateField = (property: string): string => {
  switch (property.trim().toLowerCase()) {
    case "normal":
      return "عادية";
    case "mid":
      return "متوسطة";
    case "high":
      return "عالية";
    default:
      return "";
  }
};

export const transformText = (text: string, replacement: string): string => {
  return text.replace(`&&::PROD::&&`, replacement);
};
