import * as fs from "fs/promises";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import { Logger } from "../../commons/libs/logger";
import { RedisClient } from "../../commons/libs/redis-client";
import { TokenNotValidException } from "../../commons/errors/exceptions";

const fileName = path.basename(__filename);
const logger = Logger.Instance;

const PUB_KEY_PATH = path.join(__dirname, "../../../id_rsa_pub.pem");
const PRIV_KEY_PATH = path.join(__dirname, "../../../id_rsa_priv.pem");

let PUB_KEY: string;
let PRIV_KEY: string;

async function loadKeys() {
  try {
    [PUB_KEY, PRIV_KEY] = await Promise.all([
      fs.readFile(PUB_KEY_PATH, "utf8"),
      fs.readFile(PRIV_KEY_PATH, "utf8"),
    ]);
    logger.info(`${fileName}::loadKeys - RSA keys loaded successfully.`);
  } catch (error) {
    logger.error(`${fileName}::loadKeys - Unable to load RSA keys: ${error}`);
    throw new Error("Unable to load RSA keys.");
  }
}

loadKeys().catch((err) => {
  logger.error(`${fileName}::loadKeys - Initial loading error: ${err}`);
  process.exit(1);
});

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

  // ✅ Find and validate token
  async findToken(token: string): Promise<any> {
    if (!token) throw new TokenNotValidException();

    try {
      const payload = jwt.verify(token, PUB_KEY, {
        algorithms: ["RS256"],
      });

      if (!payload) throw new TokenNotValidException();

      const isLoggedOut = await this.redisClient.receive(
        "hget",
        token,
        "logout"
      );
      if (isLoggedOut) {
        logger.warn("Token is marked as logged out.");
        return null;
      }

      return payload;
    } catch (error: any) {
      logger.error(`Error verifying token: ${error.message}`);
      throw new TokenNotValidException();
    }
  }

  // ✅ Delete token and mark it as logged out
  async deleteToken(token: string): Promise<void> {
    if (!token) throw new TokenNotValidException();

    try {
      await this.redisClient.del(token);
      logger.info(`${fileName}::deleteToken - Token deleted successfully.`);
    } catch (error) {
      logger.error(
        `${fileName}::deleteToken - Error deleting token: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw new TokenNotValidException();
    }
  }

  // ✅ Create new token
  async createToken(userData: any): Promise<string> {
    const payload = {
      userId: userData._id.$oid || userData._id,
      email: (userData.email as string).toLowerCase().trim(),
    };

    logger.info(
      `${fileName}::createToken - Creating token for user _id: ${payload.userId}`
    );

    const TTL = 60 * 60 * 24;

    const token = jwt.sign(payload, PRIV_KEY, {
      expiresIn: `${TTL}s`,
      algorithm: "RS256",
    });

    const userObj = userData.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    await this.redisClient.broadcast(
      "set",
      token,
      JSON.stringify(userWithoutPassword),
      { EX: TTL }
    );
    logger.info(`${fileName}::createToken - Token stored in Redis.`);

    return token;
  }

  // ✅ Disconnect all Redis connections
  async disconnectAll() {
    await this.redisClient.disconnectAll();
  }
}
