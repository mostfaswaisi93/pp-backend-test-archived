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

const config = {
  url: "http://localhost:8990/",
  // oracle: {
  //   host: "192.168.2.38", //109.107.238.68
  //   connectString:
  //     "(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = 192.168.2.38)(PORT = 1521))(CONNECT_DATA=(SERVER = DEDICATED)(SERVICE_NAME = orcl12cr2)))",
  //   port: 1521,
  //   username: "ncsi_epublications",
  //   password: "ncsi_epublications",
  //   database: "orcl12cr2",
  // },
  redisConfig: [
    {
      host: "127.0.0.1",
      port: 6379,
      db: 0,
    },
  ],
};

export { config };

// import { createClient } from "redis";
// import dotenv from "dotenv";

// dotenv.config();

// const redisClient = createClient({
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//   },
// });

// redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

// redisClient.connect().then(() => console.log("✅ Redis Connected..."));

// export default redisClient;
