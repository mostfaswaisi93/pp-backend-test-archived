import { Server } from "socket.io";
import { createServer } from "http";
import { Logger } from "../commons/libs/Logger"; // لاستعمال اللوجر
// import { redisConfig } from "../config/redis"; // لاستعمال إعدادات Redis
import { RedisClient } from "../commons/libs/RedisClient"; // لاستعمال Redis

export class SocketServer {
  private logger = new Logger().log();
  private io: Server;

  constructor(private httpServer: any) {
    // إنشاء سيرفر Socket.io
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*", // إضافة CORS إذا كنت تحتاج للسماح لطلبات عبر النطاقات
        methods: ["GET", "POST"],
      },
    });

    this.listen();
  }

  // وظيفة الاستماع للتواصل عبر الـ Socket
  listen() {
    this.io.on("connection", (socket) => {
      this.logger.info(`A user connected: ${socket.id}`);

      socket.on("disconnect", () => {
        this.logger.info(`User disconnected: ${socket.id}`);
      });

      // إرسال رسائل إلى Redis عبر `broadcast`
      socket.on("send_message", (message) => {
        this.sendMessageToRedis(message);
      });
    });
  }

  // إرسال رسالة إلى Redis
  private sendMessageToRedis(message: string) {
    const redisClient = RedisClient.Instance; // الوصول إلى RedisClient

    // redisClient.broadcast("set", "message", message, (err, result) => {
    //   if (err) {
    //     this.logger.error("Error while sending message to Redis:", err);
    //   } else {
    //     this.logger.info("Message sent to Redis:", result);
    //   }
    // });
  }
}
