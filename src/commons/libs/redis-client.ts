import { createClient, RedisClientType } from "redis";
import { MongoClient } from "mongodb";
import os from "os";
import { Logger } from "../libs/logger";
import { config } from "../../config/redis-config";
import RedisConfigInterface from "../../interfaces/redis.interface";

export class RedisClient {
  private static _instance: RedisClient;
  private logger = Logger.Instance.log();
  private redisClientList: RedisClientType<any>[] = [];
  private redisClientInfo = new Map<
    RedisClientType<any>,
    RedisConfigInterface
  >();
  private mongoClient: MongoClient | null = null;

  private constructor() {
    config.redisConfig.forEach((options: RedisConfigInterface) => {
      const client = this.createRedisClientObject(options);
      this.redisClientList.push(client);
      this.redisClientInfo.set(client, options);
    });

    this.connectMongoDB();
  }

  static get Instance(): RedisClient {
    if (!this._instance) {
      this._instance = new RedisClient();
    }
    return this._instance;
  }

  private createRedisClientObject(
    options: RedisConfigInterface
  ): RedisClientType<any> {
    const client = createClient({
      socket: {
        host: options.host,
        port: options.port,
        reconnectStrategy: (retries) =>
          retries > 30 ? new Error("Retry limit exceeded") : 3000,
      },
      database: options.db ?? 0,
    });

    client.on("connect", () =>
      this.logger.info(
        `✅ Connected to Redis (${options.host}:${options.port})`
      )
    );

    client.on("error", (err) =>
      this.logger.error(`❌ Redis error (${options.host}):`, err)
    );

    client.connect();
    return client as RedisClientType<any>;
  }

  private async connectMongoDB() {
    try {
      this.mongoClient = new MongoClient(config.mongoDB.url);
      await this.mongoClient.connect();
      this.logger.info(`✅ Connected to MongoDB at ${config.mongoDB.url}`);
    } catch (error) {
      this.logger.error("❌ MongoDB Connection Error:", error);
    }
  }

  public getMongoDB(): MongoClient | null {
    return this.mongoClient;
  }

  broadcast(methodName: string, ...args: any[]): void {
    this.redisClientList.forEach((redisClient) => {
      if (
        typeof redisClient[methodName as keyof RedisClientType<any>] ===
        "function"
      ) {
        (redisClient[methodName as keyof RedisClientType<any>] as Function)(
          ...args
        );
      } else {
        this.logger.warn(`⚠️ No method ${methodName} found in Redis Client.`);
      }
    });
  }

  receive(methodName: string, ...args: any[]) {
    const _redisClient = this.redisClientList.find((redisClient) => {
      const clientInfo = this.redisClientInfo.get(redisClient);
      return clientInfo && this.isLocalHost(clientInfo.host);
    });

    if (!_redisClient) {
      this.logger.warn(
        `⚠️ No local Redis client found for method ${methodName}.`
      );
      return null;
    }

    const method = _redisClient[methodName as keyof RedisClientType<any>];
    if (typeof method === "function") {
      return (method as Function)(...args);
    } else {
      this.logger.warn(
        `⚠️ Method ${methodName} is not a valid function on the Redis client.`
      );
      return null;
    }
  }

  private isLocalHost(address: string | undefined): boolean {
    if (!address) return false;
    const localAddresses = ["127.0.0.1", "localhost", "::1"];
    if (localAddresses.includes(address)) return true;

    const networkInterfaces = os.networkInterfaces();
    return Object.values(networkInterfaces)
      .flat()
      .some((iface) => iface?.address === address);
  }
}
