import AccessTokenService from "./access-token-service";
import { Strategy } from 'passport-http-bearer';

class PassportBearer {

  private accessTokenService: AccessTokenService = AccessTokenService.Instance;

  private static _instance;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  bearerAuth = async (token:string, cb) => {

    try {

      let payload = await this.accessTokenService.findToken(token);

      if (!payload) {
        return cb(true, null);
      }

      return cb(null, { payload: payload, token: token })
    } catch (e) {
      return cb(true, null);
    }
  };
}

export default new Strategy(new PassportBearer().bearerAuth);
