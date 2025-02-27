import { Server } from "socket.io";
import { Logger } from "../commons/libs/logger";
import { RedisClient } from "../commons/libs/redis-client";
const logger = Logger.Instance;

export class SocketServer {
  private io: Server;

  constructor(private httpServer: any) {
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.listen();
  }

  listen() {
    this.io.on("connection", (socket) => {
      logger.info(`A user connected: ${socket.id}`);

      socket.on("disconnect", () => {
        logger.info(`User disconnected: ${socket.id}`);
      });

      socket.on("send_message", (message) => {
        this.sendMessageToRedis(message);
      });
    });
  }

  private sendMessageToRedis(message: string) {
    const redisClient = RedisClient.Instance;
  }
}
