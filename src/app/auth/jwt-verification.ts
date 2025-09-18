import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {
  unauthorizedResponse,
  errorResponse,
} from "../../commons/http-response/api-responses";

interface CustomRequest extends Request {
  doc?: JwtPayload;
  ROLE?: string[];
}

const verifyJWT = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = request.headers.authorization;

    if (!token) {
      unauthorizedResponse(response, "No authorization token provided.");
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (error) => {
      if (error) {
        unauthorizedResponse(response, "Token is invalid or expired.");
        return;
      }

      const payload = jwt.decode(token, { complete: true })
        ?.payload as JwtPayload;
      request.doc = payload;

      // Legacy access control check - now handled by AuthService middleware
      // if (request.ROLE && request.ROLE.length > 0) {
      //   const userRole = payload?.access_control?.[0]?.roleCode;
      //   if (!userRole || !request.ROLE.includes(userRole)) {
      //     unauthorizedResponse(
      //       response,
      //       "You do not have permission to access this resource."
      //     );
      //     return;
      //   }
      // }

      next();
    });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    errorResponse(response, "An internal server error occurred.");
    return;
  }
};

export default verifyJWT;
