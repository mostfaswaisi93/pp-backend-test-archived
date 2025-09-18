import os from "os";
import { MongoClient } from "mongodb";
import { Logger } from "../libs/logger";
import { config } from "../../config/redis";
import { createClient, RedisClientType } from "redis";
import RedisConfigInterface from "../../interfaces/redis.interface";

export class RedisClient {
  private static _instance: RedisClient;
  private logger = Logger.Instance;
  private redisClientList: RedisClientType<any>[] = [];
  private redisClientInfo = new Map<
    RedisClientType<any>,
    RedisConfigInterface
  >();
  private mongoClient: MongoClient | null = null;
  private maxRetries = 30;

  private constructor() {
    this.initializeRedisClients();
    // this.connectMongoDB();
    this.handleProcessExit();
    // setImmediate(() => {
    //   this.checkRedisConnection();
    // });
  }

  static get Instance(): RedisClient {
    if (!this._instance) this._instance = new RedisClient();
    return this._instance;
  }

  private initializeRedisClients() {
    config.redisConfig.forEach((options: RedisConfigInterface) => {
      const client = this.createRedisClientObject(options);
      this.redisClientList.push(client);
      this.redisClientInfo.set(client, options);
    });
  }

  private createRedisClientObject(
    options: RedisConfigInterface
  ): RedisClientType<any> {
    const client = createClient({
      socket: {
        host: options.host,
        port: options.port,
        reconnectStrategy: (retries) =>
          retries > this.maxRetries ? new Error("Retry limit exceeded") : 3000,
      },
      database: options.db ?? 0,
    });

    client.on("connect", () =>
      this.logger.info(`✅ Redis connected on ${options.host}:${options.port}`)
    );
    client.on("error", (error) =>
      this.logger.error(
        `${options.host}:${options.port} - ❌ Redis error`,
        error
      )
    );

    client
      .connect()
      .catch((err) => this.logger.error("❌ Redis connection failed:", err));

    return client as RedisClientType<any>;
  }

  private getLocalClient(): RedisClientType<any> | null {
    return (
      this.redisClientList.find((c) => {
        const info = this.redisClientInfo.get(c);
        if (!info) return false;
        const localAddresses = ["127.0.0.1", "localhost", "::1"];
        if (localAddresses.includes(info.host)) return true;

        const networkInterfaces = os.networkInterfaces();
        return Object.values(networkInterfaces)
          .flat()
          .some((iface) => iface?.address === info.host);
      }) ?? null
    );
  }

  // ✅ Core Redis operations on the local client
  public async set(key: string, value: string, options?: any) {
    const client = this.getLocalClient();
    if (!client) throw new Error("No local Redis client available.");
    return await client.set(key, value, options);
  }

  public async get(key: string) {
    const client = this.getLocalClient();
    if (!client) return null;
    return await client.get(key);
  }

  public async delete(key: string) {
    const client = this.getLocalClient();
    if (!client) return;
    await client.del(key);
  }

  public async ping() {
    const client = this.getLocalClient();
    if (!client) return;
    return await client.ping();
  }

  public async disconnectAll() {
    for (const client of this.redisClientList) {
      try {
        await client.quit();
      } catch (error: any) {
        this.logger.error("❌ Error disconnecting Redis client:", error);
      }
    }

    if (this.mongoClient) {
      try {
        await this.mongoClient.close();
      } catch (error: any) {
        this.logger.error("❌ Error disconnecting MongoDB client:", error);
      }
    }
  }

  private handleProcessExit() {
    process.on("SIGINT", async () => {
      await this.disconnectAll();
      process.exit(0);
    });
    process.on("SIGTERM", async () => {
      await this.disconnectAll();
      process.exit(0);
    });
  }
}
