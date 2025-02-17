import { Logger } from "../../commons/libs/logger";
import { TokenNotValidException } from "../../commons/errors/exceptions";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import { promisify } from "util";

const fileName = __filename.slice(__dirname.length + 1);

const PUB_KEY = fs.readFileSync(__dirname + "/../../../id_rsa_pub.pem", "utf8");
const PRIV_KEY = fs.readFileSync(
  __dirname + "/../../../id_rsa_priv.pem",
  "utf8"
);

export default class AccessTokenService {
  private logger: Logger = new Logger();

  private static _instance: AccessTokenService; // تعيين النوع هنا

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  constructor() {}

  async findToken(accessToken: string): Promise<any> {
    if (!accessToken) {
      throw new TokenNotValidException();
    }

    try {
      const payload = jwt.verify(accessToken, PUB_KEY, {
        algorithms: ["RS256"],
      });

      // طباعة سجل عند نجاح التحقق من التوكن
      this.logger.info(
        // `Token successfully verified for user: ${payload.userId}`
        `Token successfully verified for user`
      );
    } catch (err: unknown) {
      // التأكد من أن الخطأ هو من النوع Error قبل استخدامه
      if (err instanceof Error) {
        this.logger.error(`Error verifying token: ${err.message}`);
      } else {
        this.logger.error("Unknown error occurred during token verification.");
      }
      throw new Error("Token verification failed");
    }
  }

  deleteToken(accessToken: string) {}

  async findUserByToken(accessToken: string): Promise<any> {
    if (!accessToken) {
      throw new TokenNotValidException();
    }

    const payload = await this.findToken(accessToken);
    return payload ? payload.userId : null;
  }

  createToken(user: {
    userId: number;
    userType: string;
    nameAr: string;
    nameEn: string;
  }): string {
    const payloadObj = {
      userId: user.userId,
      userType: user.userType,
      name: `${user.nameAr} ${user.nameEn}`,
    };

    this.logger.info(
      `${fileName}::createToken - user_id: ${payloadObj.userId}`
    );
    const TTL = 60 * 60 * 24; // صلاحية التوكن 24 ساعة
    const accessToken = jwt.sign(payloadObj, PRIV_KEY, {
      expiresIn: `${TTL}s`,
      algorithm: "RS256",
    });

    return accessToken;
  }
}
