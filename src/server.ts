import http from "http";
import debugLib from "debug";
import App from "../src/app";
import { connectToDatabase } from "./config/database";
import { Server as SocketServer } from "socket.io";
import { RedisClient } from "./commons/libs/redis-client";
import { Logger } from "./commons/libs/logger";
import * as controllers from "./app/index";
import Controller from "./interfaces/controller.interface";

// Variables
const debug = debugLib("peakproz-backend:server");
const logger = Logger.Instance.log();
const PORT: number | string | false = normalizePort(process.env.PORT || "8000");

// Initialize App
const appInstance = new App(getControllers());
appInstance.start();
appInstance.getApp().set("port", PORT);

// Create HTTP Server
const server = http.createServer(appInstance.getApp());

// Initialize Socket.io
const io = new SocketServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
initializeSocketIO(io);

// Connect to Database and Start Server
dbConnection().then(() => startServer(server));

// Helper Functions
// Normalize port value
function normalizePort(value: string): number | string | false {
  const port = parseInt(value, 10);
  if (isNaN(port)) return value;
  if (port >= 0) return port;
  return false;
}

// Get all controllers dynamically
function getControllers(): Controller[] {
  const controllersArray: Controller[] = [];
  Object.keys(controllers).forEach((key) => {
    controllersArray.push(new (<any>controllers)[key]());
  });
  return controllersArray;
}

// Initialize Socket.io with Redis
function initializeSocketIO(io: SocketServer) {
  io.on("connection", (socket) => {
    logger.info(`A user connected: ${socket.id}`);
    socket.on("send_message", (message) => handleMessage(message));
    socket.on("disconnect", () => handleDisconnect(socket));
  });
}

// Handle received message
function handleMessage(message: string) {
  logger.info("Message received:", message);
  const redisClient = RedisClient.Instance;
  redisClient.broadcast("set", "message", message);
}

// Handle socket disconnection
function handleDisconnect(socket: any) {
  logger.info(`User disconnected: ${socket.id}`);
}

// Database connection
async function dbConnection() {
  try {
    await connectToDatabase();
  } catch (error: any) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
}

// Start the server
function startServer(server: http.Server) {
  server.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
  server.on("error", onError);
  server.on("listening", onListening);
}

// Error handling for server
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;
  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      handleError(`${bind} requires elevated privileges`);
      break;
    case "EADDRINUSE":
      handleError(`${bind} is already in use`);
      break;
    default:
      throw error;
  }
}

// Handle error and stop the process
function handleError(message: string) {
  debug(`❌ ${message}`);
  console.error(message);
  logger.error(message);
  process.exit(1);
}

// Log when the server starts listening
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
