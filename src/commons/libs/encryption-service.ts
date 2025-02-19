import * as crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

const ALGORITHM = "aes-256-cbc";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
const IV = Buffer.from(process.env.ENCRYPTION_IV || "", "hex");

if (KEY.length !== 32 || IV.length !== 16) {
  throw new Error(
    "Invalid encryption key or IV. Ensure they are set correctly in environment variables."
  );
}

export class EncryptionService {
  private static _instance: EncryptionService;

  static get Instance(): EncryptionService {
    if (!this._instance) {
      this._instance = new EncryptionService();
    }
    return this._instance;
  }

  private constructor() {}

  encrypt(text: string): string {
    try {
      const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
      let encrypted = cipher.update(text, "utf-8");
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return encrypted.toString("hex");
    } catch (error) {
      console.error("Encryption Error:", error);
      throw new Error("Encryption failed.");
    }
  }

  decrypt(encryptedText: string): string {
    try {
      const encryptedBuffer = Buffer.from(encryptedText, "hex");
      const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
      let decrypted = decipher.update(encryptedBuffer);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString("utf-8");
    } catch (error) {
      console.error("Decryption Error:", error);
      throw new Error("Decryption failed. Invalid input.");
    }
  }
}

export default EncryptionService.Instance;
