import redis from "../config/redis";

class CacheService {
  async setCache<T>(
    key: string,
    data: T,
    expireTime: number = 3600
  ): Promise<void> {
    await redis.set(key, JSON.stringify(data), "EX", expireTime);
  }

  async getCache<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteCache(key: string): Promise<void> {
    await redis.del(key);
  }
}

export default new CacheService();
