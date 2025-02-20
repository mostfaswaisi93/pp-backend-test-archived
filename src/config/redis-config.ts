const config = {
  url: "http://localhost:8990/",
  mongoDB: {
    url: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/peakproz",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  redisConfig: [
    {
      host: "127.0.0.1",
      port: 6379,
      db: 0,
    },
  ],
};

export { config };
