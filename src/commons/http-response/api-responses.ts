import { Response, Request } from "express";
import { validationResult } from "express-validator";

interface ApiResponse {
  status: number;
  resultType: string;
  response: string;
  data?: any;
  totalCount?: number | null;
}

const sendJSONResponse = (res: Response, responseData: ApiResponse) => {
  return res.status(responseData.status).json(responseData);
};

export const successResponse = (res: Response, msg: string) => {
  return sendJSONResponse(res, {
    status: 200,
    resultType: "success",
    response: msg,
  });
};

export const successResponseWithData = (
  res: Response,
  msg: string,
  data: any,
  totalCount?: number
) => {
  return sendJSONResponse(res, {
    status: 200,
    resultType: "success",
    response: msg,
    data,
    totalCount: totalCount || null,
  });
};

export const successResponseWithExtraData = (
  res: Response,
  msg: string,
  data: any
) => {
  return sendJSONResponse(res, {
    status: 200,
    resultType: "success",
    response: msg,
    ...data,
  });
};

export const methodNotAllowed = (res: Response, msg: string) => {
  return sendJSONResponse(res, {
    status: 406,
    resultType: "Not Allowed",
    response: msg,
  });
};

export const errorResponse = (res: Response, msg: string) => {
  return sendJSONResponse(res, {
    status: 500,
    resultType: "error",
    response: msg,
  });
};

export const throwErrorResponse = (res: Response, error: string) => {
  return sendJSONResponse(res, {
    status: 400,
    resultType: "error",
    response: error,
  });
};

export const notFoundResponse = (res: Response, msg: string) => {
  return sendJSONResponse(res, {
    status: 404,
    resultType: "not found",
    response: msg,
  });
};

export const ratingNotAvailable = (res: Response, msg: string) => {
  return sendJSONResponse(res, {
    status: 404,
    resultType: "Not Available",
    response: msg,
  });
};

export const notFoundResponseWithOutData = (res: Response, msg: string) => {
  return res
    .status(404)
    .json({ status: 404, resultType: "not found", response: msg });
};

export const validationErrorWithDetails = (
  res: Response,
  msg: string,
  data: any
) => {
  return sendJSONResponse(res, {
    status: 400,
    resultType: "validation error",
    response: msg,
    data,
  });
};

export const unauthorizedResponse = (res: Response, msg: string) => {
  return res
    .status(401)
    .json({ status: 401, resultType: "unauthorized", response: msg });
};

export const invalidPermissions = (res: Response, msg: string) => {
  return sendJSONResponse(res, {
    status: 406,
    resultType: "Invalid",
    response: msg,
  });
};

export const alreadyExist = (res: Response, msg: string) => {
  return sendJSONResponse(res, {
    status: 409,
    resultType: "conflict",
    response: msg,
  });
};

export const expressValidatorCheck = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    return validationErrorWithDetails(res, "Validation errors occurred", {
      errors: errorMessages,
    });
  }
};
