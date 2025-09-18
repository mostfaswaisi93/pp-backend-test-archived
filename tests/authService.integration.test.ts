import mongoose from "mongoose";
import AuthService from "../src/app/auth/auth-service";
import { RedisClient } from "../src/commons/libs/redis-client";
import { createTestUser, removeTestUser } from "./fixtures/user.fixture";

const MONGODB_URL = process.env.MONGO_URL as string;
const DB_NAME = process.env.DB_NAME || "peakproz";
const authService = AuthService.Instance;

let testUser: any;
let plainPassword: string;

beforeAll(async () => {
  await mongoose.connect(MONGODB_URL, { dbName: DB_NAME });

  const fixture = await createTestUser();
  testUser = fixture.user;
  plainPassword = fixture.plainPassword;

  await RedisClient.Instance.ping();
});

afterAll(async () => {
  await removeTestUser();

  await RedisClient.Instance.disconnectAll();
  await mongoose.disconnect();
});

describe("AuthService Integration Test", () => {
  it("should login successfully with correct credentials", async () => {
    const result = await authService.login(testUser.email, plainPassword);
    expect(result.userWithoutPassword.email).toBe(testUser.email);
    expect(result.token).toBeDefined();

    console.log("Logged in token:", result.token);

    const stored = await RedisClient.Instance.get(result.token);
    console.log("Token stored in Redis:", stored);
    expect(stored).toBeTruthy();
  });

  it("should fail login with wrong password", async () => {
    await expect(
      authService.login(testUser.email, "wrongpass")
    ).rejects.toThrow();
  });

  it("should checkProStatus correctly", async () => {
    const result = await authService.checkProStatus(testUser.email);
    expect(result.emailId).toBe(testUser.email);
    expect(result.status).toBe("ACTIVE");
  });

  it("should updateUserProfile correctly", async () => {
    const updated = await authService.updateUserProfile(testUser.email, {
      firstName: "UpdatedName",
    });
    expect(updated.firstName).toBe("UpdatedName");
    expect((updated as any).password).toBeUndefined();
  });

  it("should logout and delete token from Redis", async () => {
    const loginResult = await authService.login(testUser.email, plainPassword);

    console.log("Logging out token:", loginResult.token);

    await authService.logout(loginResult.token);

    const tokenInRedis = await RedisClient.Instance.get(loginResult.token);
    console.log("Token in Redis after logout:", tokenInRedis);
    expect(tokenInRedis).toBeNull();
  });
});
