import { Response, Request, NextFunction } from "express";
import { HttpException } from "../helpers/exception";
import { env } from "process";
import { exceptionMap } from "../typings/enums/http-exception";

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
