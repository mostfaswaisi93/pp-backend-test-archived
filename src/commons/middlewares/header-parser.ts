import { Response, Request, NextFunction } from "express";
import { HttpException } from "../helpers/exception";
import { exceptionMap } from "../../commons/constants/http-exceptions";
import { env } from "process";

export default async function headerParser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const language =
      (req.headers.lang as string) || env.DEFUALT_LANGUAGE || "en";

    req.lang = language;

    const validLanguages = ["en", "ar"];
    if (!validLanguages.includes(language)) {
      throw new HttpException(exceptionMap.invalidLanguage);
    }
  } catch (err) {
    return next(err);
  }

  next();
}
