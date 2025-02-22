import jwt from "jsonwebtoken";
import AccessTokenService from "./access-token-service";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

class JWTAuth {
  private accessTokenService: AccessTokenService = AccessTokenService.Instance;
  private static _instance: JWTAuth;

  private constructor() {}

  static get Instance() {
    return this._instance ?? (this._instance = new JWTAuth());
  }

  verifyToken = async (token: string): Promise<any> => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as any;

      const tokenExists = await this.accessTokenService.findToken(token);
      if (!tokenExists) {
        throw new Error("Invalid token");
      }

      return { valid: true, payload: decoded };
    } catch (error) {
      if (error instanceof Error) {
        return { valid: false, error: error.message };
      }

      return { valid: false, error: "Unknown authentication error" };
    }
  };
}

export default JWTAuth.Instance;
