import { Logger } from "../../commons/libs/logger";
import { TokenNotValidException } from "../../commons/errors/exceptions";
import { RedisClient } from "../../commons/libs/redis-client";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

const fileName = path.basename(__filename);
const logger = Logger.Instance;

// تحميل مفاتيح التشفير بأمان
const PUB_KEY_PATH = path.join(__dirname, "../../../id_rsa_pub.pem");
const PRIV_KEY_PATH = path.join(__dirname, "../../../id_rsa_priv.pem");

let PUB_KEY: string;
let PRIV_KEY: string;

try {
  PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf8");
  PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf8");
} catch (err) {
  logger.error(`${fileName}::Key Loading - Failed to load RSA keys: ${err}`);
  throw new Error("Failed to load RSA keys.");
}

export default class AccessTokenService {
  private redisClient: RedisClient = RedisClient.Instance;
  private static _instance: AccessTokenService;

  static get Instance(): AccessTokenService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  private constructor() {}

  async findToken(accessToken: string): Promise<any> {
    if (!accessToken) {
      throw new TokenNotValidException();
    }

    try {
      const payload = jwt.verify(accessToken, PUB_KEY, {
        algorithms: ["RS256"],
      });

      if (!payload) {
        throw new TokenNotValidException();
      }

      const isLoggedOut = await this.redisClient.receive(
        "hget",
        accessToken,
        "logout"
      );

      if (isLoggedOut) {
        logger.warn(`${fileName}::findToken - Token is logged out.`);
        return null;
      }

      return payload;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      logger.error(
        `${fileName}::findToken - Error verifying token: ${errorMessage}`
      );
      throw new TokenNotValidException();
    }
  }

  async deleteToken(accessToken: string): Promise<void> {
    if (!accessToken) {
      throw new TokenNotValidException();
    }

    try {
      await this.redisClient.broadcast("hset", accessToken, "logout", true);
      logger.info(`${fileName}::deleteToken - Token marked as logged out.`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      logger.error(
        `${fileName}::deleteToken - Error deleting token: ${errorMessage}`
      );
    }
  }

  async findUserByToken(accessToken: string): Promise<string | null> {
    if (!accessToken) {
      throw new TokenNotValidException();
    }

    try {
      const payload = await this.findToken(accessToken);
      return payload ? payload.userId : null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      logger.error(
        `${fileName}::findUserByToken - Error retrieving user: ${errorMessage}`
      );
      return null;
    }
  }

  createToken(user: any): string {
    const payload = {
      userId: user._id,
      userType: user.userType,
      nameAr: user.nameAr,
      nameEn: user.nameEn,
    };

    logger.info(
      `${fileName}::createToken - Creating token for user_id: ${payload.userId}`
    );

    const TTL = 60 * 60 * 24;

    return jwt.sign(payload, PRIV_KEY, {
      expiresIn: `${TTL}s`,
      algorithm: "RS256",
    });
  }
}
