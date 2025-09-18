import mongoose from "mongoose";
import AccessTokenService from "../src/app/auth/access-token-service";
import { RedisClient } from "../src/commons/libs/redis-client";
import { Logger } from "../src/commons/libs/logger";
import { TokenNotValidException } from "../src/commons/errors/exceptions";

const logger = Logger.Instance;

process.env.PRIV_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKxC9P0uFzVZ+J4b+U6N9R7KfHDbzZsRUB6C8qHbY9F1s/mWZc1x
+GBI8aW+JfO2HtzR/1yU3u2bXxq7Rsm1YksCAwEAAQJALkAqz9k6eyL5Wg7cHEt/
e1uN+kuDJu0wspbq1vPjGfR4wx9zY8r3HsJLFzZ+G2H1Gp0qPb5Wq3A0Uk5D+aNf
AQIhAP8A1H3fJ+1qJY5vG4LhQqyzb7x8ZG8k5Q7m4c5v7V3FAiEAu2G2XOSmRJoV
Z+O2wrGiwbf/tg7pD5zUyMK4V3Xwwp8CIQC7DqUeouixV8w5r3x/j8E5VbH0UqGc
u0EQ0uWL1Bb6QQIhAK57n6+3vN3a8b5ZkWnOgyCcCXaiJ3Z3Zq3V8dXOi7nCNAiEA
rIDN6b6ItV2jhhmMdOUH5VQz5h6B3ZZjOm5+9c0bQGk=
-----END RSA PRIVATE KEY-----`;

process.env.PUB_KEY = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKxC9P0uFzVZ+J4b+U6N9R7KfHDbzZsR
UB6C8qHbY9F1s/mWZc1x+GBI8aW+JfO2HtzR/1yU3u2bXxq7Rsm1YksCAwEAAQ==
-----END PUBLIC KEY-----`;

const MONGODB_URL = process.env.MONGO_URL as string;
const DB_NAME = process.env.DB_NAME || "peakproz";

const accessTokenService = AccessTokenService.Instance;

beforeAll(async () => {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: DB_NAME });
    logger.info("✅ MongoDB connected for tests");
  } catch (err: any) {
    logger.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }

  try {
    await RedisClient.Instance.ping();
    logger.info("✅ Redis connected for tests");
  } catch (err: any) {
    logger.error("❌ Redis connection failed:", err.message);
    process.exit(1);
  }
}, 30000);

afterAll(async () => {
  await RedisClient.Instance.disconnectAll();
  await mongoose.disconnect();
  logger.info("✅ Cleanup done after tests");
});

describe("AccessTokenService Integration Test", () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    email: "test@example.com",
  };

  it("should create Access Token", async () => {
    const token = await accessTokenService.createAccessToken(mockUser);
    expect(token).toBeDefined();

    const stored = await RedisClient.Instance.get(token);
    expect(stored).toBeTruthy();
  });

  it("should create Refresh Token", async () => {
    const refreshToken = await accessTokenService.createRefreshToken(mockUser);
    expect(refreshToken).toBeDefined();

    const stored = await RedisClient.Instance.get(`refresh:${refreshToken}`);
    expect(stored).toBeTruthy();
  });

  it("should refresh Access Token using Refresh Token", async () => {
    const refreshToken = await accessTokenService.createRefreshToken(mockUser);
    const result = await accessTokenService.refreshAccessToken(refreshToken);

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBe(refreshToken);
  });

  it("should find token", async () => {
    const token = await accessTokenService.createAccessToken(mockUser);
    const found = await accessTokenService.findToken(token);

    expect(found.user.email).toBe(mockUser.email);
  });

  it("should delete token", async () => {
    const token = await accessTokenService.createAccessToken(mockUser);

    await accessTokenService.deleteToken(token);
    const stored = await RedisClient.Instance.get(token);

    expect(stored).toBeNull();
  });

  it("should throw TokenNotValidException for invalid token", async () => {
    await expect(accessTokenService.findToken("invalid-token")).rejects.toThrow(
      TokenNotValidException
    );
  });
});
