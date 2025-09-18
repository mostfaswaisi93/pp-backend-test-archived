import http from "http";
import debugLib from "debug";
import App from "../src/app";
import * as controllers from "./app/index";
import { Logger } from "./commons/libs/logger";
import { Server as SocketServer } from "socket.io";
import { connectToDatabase } from "./config/database";
import { RedisClient } from "./commons/libs/redis-client";
import Controller from "./interfaces/controller.interface";

// Variables & Logger Initialization
const debug = debugLib("peakproz-backend:server");
const logger = Logger.Instance;

if (!process.env.PORT) {
  logger.error("❌ Missing required PORT in environment variables.");
  process.exit(1);
}

const PORT: number | string | false = normalizePort(process.env.PORT);

async function main() {
  try {
    // Initialize App
    const appInstance = new App(getControllers());
    await appInstance.start();
    appInstance.getApp().set("port", PORT);

    // Create HTTP Server
    const server = http.createServer(appInstance.getApp());

    // Initialize Socket.io
    const io = new SocketServer(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });
    initializeSocketIO(io);

    // Connect to Database
    await dbConnection();

    // Start the Server
    startServer(server);
  } catch (err) {
    console.error("Failed to start server:", err);
    logger.error("Failed to start server", { message: (err as any).message });
    process.exit(1);
  }
}

main();

// Normalize port value
function normalizePort(value: string): number | string | false {
  const port = parseInt(value, 10);
  if (isNaN(port)) return value;
  if (port >= 0) return port;
  return false;
}

// Dynamically get all controllers
function getControllers(): Controller[] {
  return Object.keys(controllers).map((key) => new (controllers as any)[key]());
}

// Socket.io Handlers
function initializeSocketIO(io: SocketServer) {
  io.on("connection", (socket) => {
    logger.info(`A user connected: ${socket.id}`);
    socket.on("send_message", (message: string) => handleMessage(message));
    socket.on("disconnect", () => handleDisconnect(socket));
  });
}

async function handleMessage(message: string) {
  logger.info("Message received", { message });
  const redisClient = RedisClient.Instance;
  await redisClient.set("message", message, { EX: 60 });
  logger.info(`✅ Message stored in Redis: ${message}`);
}

function handleDisconnect(socket: any) {
  logger.info(`User disconnected: ${socket.id}`);
}

// Database connection
async function dbConnection() {
  try {
    await connectToDatabase();
  } catch (error: any) {
    process.exit(1);
  }
}

// Start the HTTP Server
function startServer(server: http.Server) {
  server.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
  server.on("error", onError);
  server.on("listening", () => onListening(server));
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

function handleError(message: string) {
  debug(`❌ ${message}`);
  console.error(message);
  logger.error(message);
  process.exit(1);
}

// Server listening event
function onListening(server: http.Server): void {
  const address = server.address();
  if (!address) {
    const msg = "❌ Server address is undefined.";
    console.error(msg);
    logger.error(msg);
    return;
  }
  const bind =
    typeof address === "string" ? `pipe ${address}` : `port ${address.port}`;
  debug(`✅ Server is listening on ${bind}`);
  console.log(`✅ Server is listening on ${bind}`);
  console.log("Press CTRL + C to stop the process. \n");
}
