import * as path from "path";
import * as dotenv from "dotenv";
import * as fs from "fs/promises";
import * as jwt from "jsonwebtoken";
import { Logger } from "../../commons/libs/logger";
import { RedisClient } from "../../commons/libs/redis-client";
import { TokenNotValidException } from "../../commons/errors/exceptions";

dotenv.config();

const fileName = path.basename(__filename);
const logger = Logger.Instance;

if (!process.env.PUB_KEY_PATH || !process.env.PRIV_KEY_PATH) {
  throw new Error("Missing required RSA key paths in environment variables.");
}

const PUB_KEY_PATH = path.resolve(__dirname, process.env.PUB_KEY_PATH);
const PRIV_KEY_PATH = path.resolve(__dirname, process.env.PRIV_KEY_PATH);

let PUB_KEY: string;
let PRIV_KEY: string;

async function loadKeys(): Promise<void> {
  try {
    [PUB_KEY, PRIV_KEY] = await Promise.all([
      fs.readFile(PUB_KEY_PATH, "utf8"),
      fs.readFile(PRIV_KEY_PATH, "utf8"),
    ]);
    logger.info(`${fileName}::loadKeys - RSA keys loaded successfully.`);
  } catch (error) {
    logger.error(`${fileName}::loadKeys - Failed to load RSA keys: ${error}`);
    throw new Error("Failed to load RSA keys. Please check file paths.");
  }
}

loadKeys().catch((err) => {
  logger.error(`${fileName}::loadKeys - Initial loading error: ${err}`);
  process.exit(1);
});

export default class AccessTokenService {
  private static _instance: AccessTokenService;
  private redisClient: RedisClient = RedisClient.Instance;

  private constructor() {}

  static get Instance(): AccessTokenService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  async findToken(token: string): Promise<{ token: string; user: any }> {
    if (!token) {
      logger.warn(`${fileName}::findToken - No token provided.`);
      throw new TokenNotValidException();
    }

    try {
      let tokenData: string | null = await this.redisClient.receive(
        "get",
        token
      );
      let payload: any;

      if (tokenData) {
        payload = JSON.parse(tokenData);
        logger.info(`${fileName}::findToken - Token found in Redis.`);
      } else {
        try {
          payload = jwt.verify(token, PUB_KEY, { algorithms: ["RS256"] });
          logger.info(`${fileName}::findToken - Token verified via JWT.`);
        } catch (error) {
          logger.warn(`${fileName}::findToken - Invalid token.`);
          throw new TokenNotValidException();
        }
      }

      return { token, user: payload };
    } catch (error: any) {
      logger.error(
        `${fileName}::findToken - Error verifying token: ${error.message}`
      );
      throw new TokenNotValidException();
    }
  }

  async deleteToken(token: string): Promise<void> {
    if (!token) {
      logger.warn(`${fileName}::deleteToken - No token provided.`);
      throw new TokenNotValidException();
    }

    try {
      await this.redisClient.delete(token);
      logger.info(`${fileName}::deleteToken - Token deleted successfully.`);
    } catch (error) {
      logger.error(
        `${fileName}::deleteToken - Failed to delete token: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw new TokenNotValidException();
    }
  }

  async createToken(userData: any): Promise<string> {
    const JWT_TTL = 60 * 60 * 24 * 7; // 7 days

    if (!userData || !userData._id || !userData.email) {
      logger.error(`${fileName}::createToken - Invalid user data.`);
      throw new Error("User data is required to create token.");
    }

    const payload = {
      userId: userData._id?.$oid ?? userData._id,
      email: userData.email.toLowerCase().trim(),
    };

    logger.info(
      `${fileName}::createToken - Creating token for user: ${payload.userId}`
    );

    const token = jwt.sign(payload, PRIV_KEY, {
      expiresIn: `${JWT_TTL}s`,
      algorithm: "RS256",
    });

    const userWithoutPassword = { ...userData.toObject() };
    delete userWithoutPassword.password;

    await this.redisClient.broadcast(
      "set",
      token,
      JSON.stringify(userWithoutPassword),
      {
        EX: JWT_TTL,
      }
    );

    logger.info(`${fileName}::createToken - Token stored in Redis.`);

    return token;
  }

  async disconnectAll(): Promise<void> {
    await this.redisClient.disconnectAll();
  }
}
