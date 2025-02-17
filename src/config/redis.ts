// Create Redis
// export const redisConfig = {
//   host: process.env.REDIS_HOST || "localhost",
//   port: parseInt(process.env.REDIS_PORT || "6379"),
//   // password: "password",
// };

export const redisConfig = [
  {
    host: "localhost",
    port: 6379,
    password: "",
    db: 0,
    retry_strategy: (options: any) => {
      if (options.error && options.error.code === "ECONNREFUSED") {
        return new Error("The server refused the connection");
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error("Retry time exhausted");
      }
      if (options.attempt > 30) {
        return undefined;
      }
      return 3000;
    },
  },
];
