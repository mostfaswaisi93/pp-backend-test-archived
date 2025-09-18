import { RedisClient } from "../src/commons/libs/redis-client";

const redisClient = RedisClient.Instance;

describe("RedisClient Unified Integration Test", () => {
  const key = "test-key";
  const value = "hello-redis";

  it("should connect and respond to PING", async () => {
    const pong = await redisClient.ping();
    expect(pong).toBe("PONG");
  });

  it("should set and get a value", async () => {
    await redisClient.set(key, value, { EX: 10 });
    const result = await redisClient.get(key);
    expect(result).toBe(value);
  });

  it("should delete a key", async () => {
    await redisClient.set(key, value, { EX: 10 });
    await redisClient.delete(key);
    const result = await redisClient.get(key);
    expect(result).toBeNull();
  });

  afterAll(async () => {
    await redisClient.disconnectAll();
  });
});
