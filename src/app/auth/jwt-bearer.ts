import AccessTokenService from "./access-token-service";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

class JwtBearer {
  private accessTokenService: AccessTokenService = AccessTokenService.Instance;
  private static _instance: JwtBearer;
  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  bearerAuth = async (token: string, cb: (error: any, user: any) => void) => {
    if (!token) {
      return cb(true, null);
    }

    try {
      const payload = await this.verifyToken(token);
      // const payload = await this.accessTokenService.findToken(token);
      if (!payload) {
        return cb(true, null);
      }

      return cb(null, { payload: payload, token: token });
    } catch (err) {
      return cb(true, null);
    }
  };

  private verifyToken(token: string) {
    return new Promise<any>((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || "your_secret_key",
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        }
      );
    });
  }
}

export default JwtBearer;
