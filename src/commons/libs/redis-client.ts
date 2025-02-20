import { createClient, RedisClientType } from "redis";
import os from "os";
import { redisConfig } from "../../config/redis-config";
import { Logger } from "../libs/logger";

export class RedisClient {
  private static _instance: RedisClient;
  private logger = Logger.Instance.log();
  private redisClientList: RedisClientType<any>[] = [];

  private constructor() {
    redisConfig.forEach((options) => {
      this.redisClientList.push(this.createRedisClientObject(options));
    });
  }

  static get Instance(): RedisClient {
    if (!this._instance) {
      this._instance = new RedisClient();
    }
    return this._instance;
  }

  private createRedisClientObject(options: any): RedisClientType<any> {
    const client: RedisClientType<any> = createClient({
      socket: {
        host: options.host,
        port: options.port,
        reconnectStrategy: (retries) => {
          if (retries > 30) {
            this.logger.error(
              "🔴 The number of attempts allowed to reconnect to Redis has exceeded."
            );
            return new Error("Retry limit exceeded");
          }
          return 3000; // Retry after 3 seconds
        },
      },
    });

    client.on("connect", () =>
      this.logger.info("✅ Connected to Redis successfully.")
    );
    client.on("ready", () =>
      this.logger.info("🚀 Redis is ready to handle requests.")
    );
    client.on("reconnecting", () =>
      this.logger.warn("⚠️ Attempting to reconnect to Redis...")
    );
    client.on("end", () => this.logger.info("🔴 Connection to Redis ended."));
    client.on("error", (err) => {
      this.logger.error("❌ Redis error:", err);
      throw new Error(err.message);
    });

    client.connect(); // Ensure connection on creation
    return client as RedisClientType<any>;
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
