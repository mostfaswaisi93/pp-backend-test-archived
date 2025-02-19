import { Logger } from "../../commons/libs/logger";
import { TokenNotValidException } from "../../commons/errors/exceptions";
import { RedisClient } from "../../commons/libs/redis-client";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as i18n from "i18n";

const fileName = __filename.slice(__dirname.length + 1);

const PUB_KEY = fs.readFileSync(__dirname + "/../../../id_rsa_pub.pem", "utf8");
const PRIV_KEY = fs.readFileSync(
  __dirname + "/../../../id_rsa_priv.pem",
  "utf8"
);

export default class AccessTokenService {
  private redisClient: RedisClient = RedisClient.Instance;

  private static _instance: AccessTokenService;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {}

  async findToken(accessToken): Promise<any> {
    if (!accessToken) {
      throw new TokenNotValidException();
    }

    return new Promise((resolve, reject) => {
      try {
        let payload = jwt.verify(accessToken, PUB_KEY, {
          algorithms: ["RS256"],
        });

        if (payload) {
          this.redisClient.receive(
            "hget",
            accessToken,
            "logout",
            (err, result) => {
              if (!result) {
                return resolve(payload);
              } else {
                return resolve(null);
              }
            }
          );
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  deleteToken(accessToken) {
    this.redisClient.broadcast("hset", accessToken, "logout", true);
  }

  async findUserByToken(accessToken): Promise<any> {
    if (!accessToken) {
      throw new TokenNotValidException();
    }

    return new Promise((resolve, reject) => {
      this.findToken(accessToken).then((payload) => {
        resolve(payload.userId);
      });
    });
  }

  createToken(user) {
    let payloadObj = {
      userId: user.userId,
      userType: user.userType,
      name: user.nameAr + " " + user.nameEn,
    };
    new Logger()
      .log()
      .info(`${fileName}::createToken - user_id: ${payloadObj.userId}`);
    let TTL = 60 * 60 * 24;
    let accessToken = jwt.sign(payloadObj, PRIV_KEY, {
      expiresIn: `${TTL}s`,
      algorithm: "RS256",
    });
    return accessToken;
  }
}
