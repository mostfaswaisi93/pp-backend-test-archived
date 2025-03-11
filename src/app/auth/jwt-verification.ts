import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  unauthorizedResponse,
  errorResponse,
} from "../../commons/http-response/api-responses";

interface CustomRequest extends Request {
  doc?: JwtPayload;
  ROLE?: string[];
}

const verifyJWT = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      unauthorizedResponse(res, "No authorization token provided.");
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
      if (err) {
        unauthorizedResponse(res, "Token is invalid or expired.");
        return;
      }

      const payload = jwt.decode(token, { complete: true })
        ?.payload as JwtPayload;
      req.doc = payload;

      // if (req.ROLE && req.ROLE.length > 0) {
      //   const userRole = payload?.rbac?.[0]?.roleCode;
      //   if (!userRole || !req.ROLE.includes(userRole)) {
      //     unauthorizedResponse(
      //       res,
      //       "You do not have permission to access this resource."
      //     );
      //     return;
      //   }
      // }

      next();
    });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    errorResponse(res, "An internal server error occurred.");
    return;
  }
};

export default verifyJWT;
