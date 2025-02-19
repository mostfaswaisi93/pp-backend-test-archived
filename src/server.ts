import http from "http";
import debugLib from "debug";
import app from "../src/app";
import connectDb from "./config/database";
import { Server as SocketServer } from "socket.io";
import { RedisClient } from "./commons/libs/redis-client";
import { Logger } from "./commons/libs/logger";

const debug = debugLib("backend:server");
const logger = Logger.Instance.log();

// PORT `.env` 8000
const PORT = process.env.PORT || 8000;
app.set("port", PORT);

// Server
const server = http.createServer(app);

// إضافة Socket.io مع HTTP server
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// إعدادات الـ Socket.io - مثال لتفاعل مع Redis عند استقبال الرسائل
io.on("connection", (socket) => {
  logger.info(`A user connected: ${socket.id}`);

  socket.on("send_message", (message) => {
    logger.info("Message received:", message);
    const redisClient = RedisClient.Instance;
    redisClient.broadcast("set", "message", message);
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// DB Connection
connectDb()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
    server.on("error", onError);
    server.on("listening", onListening);
  })
  .catch((error) => {
    logger.error("❌ Database connection failed:", error);
    process.exit(1);
  });

// Error Exception
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Listening on PORT `.env` 8000
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
  logger.info(`✅ Listening on ${bind}`);
  console.log("Press CTRL + C to stop the process. \n");
}

export default server;
