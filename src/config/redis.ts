import Redis from "ioredis";

// إنشاء اتصال بـ Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost", // يمكنك تعديل الإعدادات بناءً على البيئة الخاصة بك
  port: parseInt(process.env.REDIS_PORT || "6379"), // افتراضياً 6379
});

export default redis;
