import { createClient } from "redis";
import { redisConfig } from "../../config/redis";

// إعداد عميل Redis
const redisClient = createClient({
  url: `redis://${redisConfig.host}:${redisConfig.port}`,
  //   password: redisConfig.password,
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis...");
  })
  .catch((err) => {
    console.error("Error connecting to Redis:", err);
  });

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redisClient;
