const config = {
  url: process.env.BASE_URL?.trim() || "http://localhost:8990/",

  mongoDB: {
    url: process.env.MONGO_URL?.trim() || "",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  redisConfig: [
    {
      host: process.env.REDIS_HOST?.trim() || "127.0.0.1",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      db: parseInt(process.env.REDIS_DB || "0", 10),
      password: process.env.REDIS_PASSWORD?.trim() || null,
    },
  ],
};

if (!config.mongoDB.url) {
  console.error("❌ MONGO_URL is not defined in environment variables.");
  process.exit(1);
}

export { config };
