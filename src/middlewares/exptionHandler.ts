import { exceptionMap } from "../typings/enums/httpExceptions";
import { getLocalError } from "../utils/translate";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../src/helpers/exption";
import * as locals from "../localization";
import debugLib from "debug";

const debug = debugLib("backend:error-middleware");

function errorMiddleware(
  error: HttpException | any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  debug("Error Middleware triggered:", error);

  // معالجة أخطاء Multer (رفع الملفات)
  if (error.name === "MulterError") {
    error = handleMulterError(error);
  }

  const status = error.status || 500;
  let message = error.message || "Something went wrong";
  const customCode = error.customCode || "500";

  // في وضع الإنتاج، يجب إخفاء تفاصيل الأخطاء الداخلية
  if (status === 500 && process.env.ENVIRONMENT !== "development") {
    message = "Something went wrong";
  }

  // إنشاء كائن الاستجابة مع الأخطاء المترجمة
  const response = {
    status,
    customCode,
    translatable: generateLocalizedErrors(message),
    details: error.details || [],
  };

  return res.status(status).json(response);
}

// ✅ **معالجة أخطاء `Multer` بشكل منفصل**
function handleMulterError(error: any) {
  switch (error.code) {
    case "LIMIT_FILE_SIZE":
      return exceptionMap.fileSize;
    default:
      return exceptionMap.fileSize;
  }
}

// ✅ **توليد الأخطاء بجميع اللغات المدعومة**
function generateLocalizedErrors(message: string) {
  const translatable: Record<string, string> = {};
  for (const lang in locals) {
    translatable[lang] = getLocalError(message, lang) || message;
  }
  return translatable;
}

export default errorMiddleware;
