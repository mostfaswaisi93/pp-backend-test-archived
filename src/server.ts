import http from "http";
import debugLib from "debug";
import app from "../src/app";
import connectToDatabase from "./config/database";
import { Server as SocketServer } from "socket.io";
import { RedisClient } from "./commons/libs/redis-client";
import { Logger } from "./commons/libs/logger";

const debug = debugLib("backend:server");
const logger = Logger.Instance.log();

// Normalize a port into a number, string, or false.
function normalizePort(val: string): number | string | false {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val; // Named pipe
  if (port >= 0) return port; // Port number
  return false;
}

// إعدادات الـ PORT
const PORT: number | string | false = normalizePort(process.env.PORT || "8000");
app.set("port", PORT);

// إنشاء الـ HTTP server
const server = http.createServer(app);

// إضافة Socket.io مع HTTP server
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// إعدادات الـ Socket.io - التعامل مع Redis
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

// دالة الاتصال بقاعدة البيانات
const bootstrap = async (): Promise<boolean> => {
  try {
    await connectToDatabase();
    logger.info("✅ Database connected successfully");
    startServer();
    return true;
  } catch (error: any) {
    logger.error(
      `❌ ${error.status || 500} - ${error.message} - Connection Error`
    );
    throw new Error(error.message);
  }
};

// دالة لبدء السيرفر بعد التأكد من الاتصال بالقاعدة
const startServer = () => {
  server.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });

  server.on("error", onError);
  server.on("listening", onListening);
};

// Error Exception
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (error.code) {
    case "EACCES":
      debug(`❌ ${bind} requires elevated privileges`);
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      debug(`❌ ${bind} is already in use`);
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Listening on PORT `.env` 8000
function onListening(): void {
  const address = server.address();
  if (!address) {
    debug("❌ Server address is undefined.");
    console.error("❌ Server address is undefined.");
    logger.error("❌ Server address is undefined.");
    return;
  }

  const bind =
    typeof address === "string" ? `pipe ${address}` : `port ${address.port}`;

  debug(`✅ Server is listening on ${bind}`);
  console.log(`✅ Server is listening on ${bind}`);
  console.log("Press CTRL + C to stop the process. \n");
}

// بدء الاتصال بالقاعدة وتهيئة السيرفر
bootstrap();

export default server;
