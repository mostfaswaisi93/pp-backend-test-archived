import { Logger } from "../../commons/libs/logger";
import { RedisClient } from "../../commons/libs/redisClient";
import { TokenNotValidException } from "../../commons/errors/exceptions";
import jwt, { Algorithm } from "jsonwebtoken";
import { JWT_CONFIG } from "../../config/jwt";

export default class AccessTokenService {
  private redisClient = RedisClient.Instance;
  private logger = Logger.Instance;

  private static _instance: AccessTokenService;

  static get Instance() {
    if (!this._instance) {
      this._instance = new AccessTokenService();
    }
    return this._instance;
  }

  private constructor() {}

  async findToken(accessToken: string): Promise<any> {
    if (!accessToken) throw new TokenNotValidException();

    try {
      const algorithm: Algorithm = JWT_CONFIG.ALGORITHM as Algorithm;

      const payload = jwt.verify(accessToken, JWT_CONFIG.PUB_KEY, {
        algorithms: [algorithm],
      });

      const logoutStatus = await this.redisClient.receive(
        "hget",
        accessToken,
        "logout"
      );

      return logoutStatus ? null : payload;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`findToken error: ${error.message}`);
      } else {
        this.logger.error(`findToken error: ${JSON.stringify(error)}`);
      }
      throw new TokenNotValidException();
    }
  }

  async deleteToken(accessToken: string): Promise<void> {
    try {
      await this.redisClient.broadcast("hset", accessToken, "logout", true);
      this.logger.info(`Token invalidated: ${accessToken}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`deleteToken error: ${error.message}`);
      } else {
        this.logger.error(`deleteToken error: ${JSON.stringify(error)}`);
      }
    }
  }

  async findUserByToken(accessToken: string): Promise<number | null> {
    const payload = await this.findToken(accessToken);
    return payload ? payload.userId : null;
  }

  createToken(user: {
    userId: number;
    userType: string;
    nameAr: string;
    nameEn: string;
  }): string {
    const payload = {
      userId: user.userId,
      userType: user.userType,
      name: `${user.nameAr} ${user.nameEn}`,
    };

    const algorithm: Algorithm = JWT_CONFIG.ALGORITHM as Algorithm;

    this.logger.info(`Creating token for user_id: ${payload.userId}`);

    return jwt.sign(payload, JWT_CONFIG.PRIV_KEY, {
      expiresIn: JWT_CONFIG.TTL,
      algorithm: algorithm,
    });
  }
}
