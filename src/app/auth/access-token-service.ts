import * as path from "path";
import * as fs from "fs/promises";
import * as jwt from "jsonwebtoken";
import { Logger } from "../../commons/libs/logger";
import { RedisClient } from "../../commons/libs/redis-client";
import { TokenNotValidException } from "../../commons/errors/exceptions";

const logger = Logger.Instance;

if (!process.env.PUB_KEY_PATH || !process.env.PRIV_KEY_PATH) {
  throw new Error("Missing required RSA key paths in environment variables.");
}

const PUB_KEY_PATH = path.resolve(__dirname, process.env.PUB_KEY_PATH!);
const PRIV_KEY_PATH = path.resolve(__dirname, process.env.PRIV_KEY_PATH!);

let PUB_KEY: string;
let PRIV_KEY: string;

// Load RSA keys asynchronously at startup
async function loadKeys(): Promise<void> {
  try {
    [PUB_KEY, PRIV_KEY] = await Promise.all([
      fs.readFile(PUB_KEY_PATH, "utf8"),
      fs.readFile(PRIV_KEY_PATH, "utf8"),
    ]);
    logger.info(`loadKeys - RSA keys loaded successfully.`);
  } catch (error) {
    logger.error(`loadKeys - Failed to load RSA keys: ${error}`);
    process.exit(1);
  }
}

export default class AccessTokenService {
  private static _instance: AccessTokenService;
  private redisClient = RedisClient.Instance;

  // Token Time-To-Live in seconds
  private TTL: number = 60 * 60 * 24; // 1 day

  private keysLoaded: boolean = false;

  private constructor() {}

  static get Instance() {
    if (!this._instance) this._instance = new this();
    return this._instance;
  }

  // Load RSA keys
  async init() {
    if (!this.keysLoaded) {
      await loadKeys();
      this.keysLoaded = true;
    }
  }

  // ✅ Create a new Access Token and store it in Redis
  async createToken(userData: any) {
    await this.init();

    // ✅ Validate userData
    if (!userData || !userData._id || !userData.email) {
      logger.error("createToken - Invalid user data received.");
      const error: any = new Error("User data is required to create token.");
      error.status = 400;
      throw error;
    }

    const payload = {
      userId: userData._id,
      email: userData.email.toLowerCase(),
      roles: userData.roles || [],
    };

    try {
      // ✅ Generate token
      const token = jwt.sign(payload, PRIV_KEY, {
        algorithm: "RS256",
        expiresIn: this.TTL,
      });

      const userWithoutSensitiveData = {
        ...(userData.toObject?.() ?? userData),
      };
      delete userWithoutSensitiveData.password;
      delete userWithoutSensitiveData.secret;

      const storeToken = await this.redisClient.set(
        token,
        JSON.stringify(userWithoutSensitiveData),
        { EX: this.TTL }
      );

      if (!storeToken) {
        logger.error(
          `createToken - Failed to store token for user: ${userData.email}`
        );
        const error: any = new Error("Failed to store session in Redis.");
        error.status = 500;
        throw error;
      }

      logger.info(`Token created successfully for user: ${userData.email}`);
      return token;
    } catch (error: any) {
      logger.error(
        `createToken - Error while creating token for user: ${
          userData.email || "unknown"
        }, Error: ${error.message}`
      );
      throw error;
    }
  }

  // ✅ Find token in Redis or verify via JWT
  async findToken(token: string) {
    await this.init();

    if (!token) throw new TokenNotValidException();

    try {
      let tokenData: any = await this.redisClient.get(token);

      if (tokenData) {
        tokenData = JSON.parse(tokenData);
        logger.info(`findToken - Token found in Redis.`);
      } else {
        try {
          tokenData = jwt.verify(token, PUB_KEY, { algorithms: ["RS256"] });
          logger.info(`findToken - Token verified via JWT.`);
        } catch (error: any) {
          logger.error(`findToken - JWT verification failed: ${error.message}`);
          throw new TokenNotValidException();
        }
      }

      return { token, user: tokenData };
    } catch (error: any) {
      logger.error(`findToken - Error: ${error.message}`);
      throw new TokenNotValidException();
    }
  }

  // ✅ Delete token from Redis
  async deleteToken(token: string) {
    await this.init();

    if (!token) throw new TokenNotValidException();
    await this.redisClient.delete(token);
    logger.info(`Token deleted: ${token}`);
  }

  // ✅ Refresh token if it's close to expiration
  async refreshToken(oldToken: string) {
    await this.init();

    if (!oldToken) {
      logger.warn("refreshToken - No token provided.");
      throw new TokenNotValidException();
    }

    try {
      const decoded: any = jwt.decode(oldToken);
      if (!decoded || !decoded.exp) {
        logger.warn(
          `refreshToken - Failed to decode token or missing expiration.`
        );
        throw new TokenNotValidException();
      }

      const timeRemaining = decoded?.exp - Math.floor(Date.now() / 1000);

      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);

      logger.info(
        `refreshToken - Token decoded. Time remaining: ${timeRemaining}s (~${hours}h ${minutes}m)`
      );

      // Time Remaining is in seconds = 10800s = 3 hours
      if (timeRemaining < 10800) {
        const { user } = await this.findToken(oldToken);
        if (!user) throw new TokenNotValidException();

        // Generate a new token
        const newToken = await this.createToken(user);

        try {
          await this.deleteToken(oldToken);
          logger.info(
            `refreshToken - Old token deleted successfully for user: ${user.email}`
          );
        } catch (error: any) {
          logger.error(
            `refreshToken - Failed to delete old token for user: ${user.email}. Error: ${error.message}`
          );
        }

        logger.info(
          `refreshToken - Token refreshed for user: ${user.email}, new token TTL applied.`
        );
        return { token: newToken, user };
      }

      return this.findToken(oldToken);
    } catch (error: any) {
      if (error instanceof TokenNotValidException) {
        logger.warn("refreshToken - Invalid token provided.");
      } else {
        logger.error(`refreshToken - Unexpected error: ${error.message}`);
      }
      throw error;
    }
  }

  // ✅ Disconnect from Redis completely
  async disconnectAll() {
    await this.redisClient.disconnectAll();
  }
}
