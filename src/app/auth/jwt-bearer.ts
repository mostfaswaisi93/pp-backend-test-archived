import jwt, { JwtPayload } from "jsonwebtoken";
import AccessTokenService from "./access-token-service";

class JwtBearerAuth {
  private accessTokenService: AccessTokenService = AccessTokenService.Instance;

  private static _instance: JwtBearerAuth;

  // استخدام معمل لتحديد مثيل واحد فقط (Singleton)
  static get Instance(): JwtBearerAuth {
    return this._instance ?? (this._instance = new this());
  }

  // دالة للتحقق من صحة التوكن
  verifyToken = async (token: string): Promise<any> => {
    try {
      const decoded = this.verifyJwtToken(token);
      if (!decoded) {
        return { success: false, message: "Invalid token" };
      }

      const payload = await this.accessTokenService.findToken(decoded.userId);
      if (!payload) {
        return { success: false, message: "Token not found in database" };
      }

      return { success: true, payload, token };
    } catch (error: unknown) {
      // التحقق من أن الخطأ هو من نوع Error
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message || "An error occurred",
        };
      }
      return { success: false, message: "An unknown error occurred" };
    }
  };

  // دالة لفك تشفير التوكن باستخدام jwt
  private verifyJwtToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET || "your_secret_key"
      ) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}

export default JwtBearerAuth.Instance;
