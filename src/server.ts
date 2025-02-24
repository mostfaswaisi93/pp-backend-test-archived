import http from "http";
import debugLib from "debug";
import App from "../src/app";
import { connectToDatabase } from "./config/database";
import { Server as SocketServer } from "socket.io";
import { RedisClient } from "./commons/libs/redis-client";
import { Logger } from "./commons/libs/logger";
import Controller from "./interfaces/controller.interface";
import User2Controller from "./app/user2/user-controller";

const debug = debugLib("peakproz-backend:server");
const logger = Logger.Instance.log();

// Normalize Port
function normalizePort(val: string): number | string | false {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const controllers = [new User2Controller()];
console.log(controllers, "controllers");

// PORT
const PORT: number | string | false = normalizePort(process.env.PORT || "8000");
const appInstance = new App(controllers);
appInstance.start();
appInstance.getApp().set("port", PORT);

const server = http.createServer(appInstance.getApp());

const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io with Redis
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

// Database Connection
const dbConnection = async () => {
  try {
    await connectToDatabase();
    await startServer();
  } catch (error: any) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Start Server on PORT `.env` 8000
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
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      debug(`❌ ${bind} is already in use`);
      console.error(`${bind} is already in use`);
      logger.error(`${bind} is already in use`);
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
    return;
  }

  const bind =
    typeof address === "string" ? `pipe ${address}` : `port ${address.port}`;

  debug(`✅ Server is listening on ${bind}`);
  console.log(`✅ Server is listening on ${bind}`);
  console.log("Press CTRL + C to stop the process. \n");
}

dbConnection();

export default server;
