import * as redis from "redis";
import * as os from "os";
import { Logger } from "./logger";
import { redisConfig } from "../../config/redis";
// import { config } from "../../../config";

export class RedisClient {
  private logger = new Logger().log();
  private redisClientList: redis.RedisClient[] = [];
  private static _instance: RedisClient;

  private constructor() {
    this.initializeClients();
  }

  static get Instance(): RedisClient {
    if (!this._instance) {
      this._instance = new RedisClient();
    }
    return this._instance;
  }

  private initializeClients(): void {
    redisConfig.redisConfig.forEach((options) => {
      this.redisClientList.push(this.createRedisClientObject(options));
    });
  }

  private createRedisClientObject(options): redis.RedisClient {
    options.retry_strategy = (options) => this.handleRetryStrategy(options);

    const client = redis.createClient(options);

    this.setupClientEvents(client);

    return client;
  }

  private handleRetryStrategy(options): Error | number | undefined {
    if (options.error && options.error.code === "ECONNREFUSED") {
      this.logger.error("Redis client connection refused:", options.error);
      // Notify admins (consider adding an async notifier if needed)
      return new Error("The server refused the connection");
    }

    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error("Retry time exhausted");
    }

    if (options.attempt > 30) {
      return undefined; // stop reconnecting
    }

    return 3000; // reconnect after 3 seconds
  }

  private setupClientEvents(client: redis.RedisClient): void {
    client.on("connect", () => this.logger.info("Redis client connected"));
    client.on("ready", () => this.logger.info("Redis client ready"));
    client.on("reconnecting", () =>
      this.logger.warn("Redis client reconnecting")
    );
    client.on("end", () => this.logger.info("Redis client connection ended"));
    client.on("error", (err) => this.handleClientError(err));
  }

  private handleClientError(err: Error): void {
    this.logger.error("Redis client error:", err);
    throw new Error(err.message);
  }

  broadcast(methodName: string, ...args: any[]): void {
    this.redisClientList.forEach((redisClient) => {
      redisClient[methodName](...args);
    });
  }

  receive(methodName: string, ...args: any[]): any {
    const localClient = this.getLocalClient();
    if (localClient) {
      return localClient[methodName](...args);
    }
    throw new Error("No local Redis client found");
  }

  private getLocalClient(): redis.RedisClient | undefined {
    return this.redisClientList.find((redisClient) =>
      this.isLocalHost(redisClient.options.host)
    );
  }

  private isLocalHost(address: string): boolean {
    const ifaces = os.networkInterfaces();
    return Object.values(ifaces).some((interfaces) =>
      interfaces.some((iface) => iface.address === address)
    );
  }
}
