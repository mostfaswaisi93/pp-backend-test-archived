import AccessTokenService from "./AccessTokenService";
import { Strategy as PassportBearerStrategy } from "passport-http-bearer";

class PassportBearer {
  private accessTokenService: AccessTokenService = AccessTokenService.Instance;

  private static _instance: PassportBearer;

  static get Instance(): PassportBearer {
    return this._instance ?? (this._instance = new this());
  }

  // Bearer Authentication middleware
  bearerAuth = async (
    token: string,
    cb: (err: any, user: any) => void
  ): Promise<void> => {
    try {
      const payload = await this.accessTokenService.findToken(token);

      if (!payload) {
        return cb(new Error("Invalid token"), null); // Error for invalid token
      }

      return cb(null, { payload, token });
    } catch (error) {
      console.error("Error while validating token:", error); // Log error for debugging
      return cb(new Error("Authentication error"), null); // Return generic authentication error
    }
  };
}

export default new PassportBearerStrategy(PassportBearer.Instance.bearerAuth);
