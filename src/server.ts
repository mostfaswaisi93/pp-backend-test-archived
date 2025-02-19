import http from "http";
import debugLib from "debug";
import app from "../src/app";
import connectDb from "./config/database";
import { Server as SocketServer } from "socket.io"; // استيراد Socket.io
import { RedisClient } from "./commons/libs/redis-client"; // استيراد RedisClient
import { Logger } from "./commons/libs/logger"; // استيراد Logger

const debug = debugLib("backend:server");

// PORT `.env` 8000
const PORT = process.env.PORT || 8000;
app.set("port", PORT);

// Server
const server = http.createServer(app);

// إضافة Socket.io مع HTTP server
const io = new SocketServer(server, {
  cors: {
    origin: "*", // السماح بالاتصالات من جميع النطاقات (يمكن تخصيصه حسب الحاجة)
    methods: ["GET", "POST"],
  },
});

// إعدادات الـ Socket.io - مثال لتفاعل مع Redis عند استقبال الرسائل
io.on("connection", (socket) => {
  const logger = new Logger().log();
  logger.info(`A user connected: ${socket.id}`);

  socket.on("send_message", (message) => {
    logger.info("Message received:", message);
    const redisClient = RedisClient.Instance;

    // إرسال الرسالة إلى Redis باستخدام broadcast
    // redisClient.broadcast("set", "message", message, (err, result) => {
    //   if (err) {
    //     logger.error("Error sending message to Redis:", err);
    //   } else {
    //     logger.info("Message sent to Redis:", result);
    //   }
    // });
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// DB Connection
connectDb()
  .then(() => {
    server.listen(PORT, () => {
      debug(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    server.on("error", onError);
    server.on("listening", onListening);
  })
  .catch((error) => {
    debug("❌ Database connection failed:", error);
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

// Error Exception
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      debug(`${bind} is already in use`);
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
  debug(`✅ Listening on ${bind}`);
  console.log(`✅ Listening on ${bind}`);
  console.log("Press CTRL + C to stop the process. \n");
}

export default server;
