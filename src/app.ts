import cors from "cors";
import http from "http";
import path from "path";
import i18n from "i18n";
import helmet from "helmet";
import express from "express";
import pinoHttp from "pino-http";
import requestIp from "request-ip";
import compression from "compression";
import { LANG_LIST } from "./commons/constants/constants";
import Controller from "../src/interfaces/controller.interface";
import { globalErrorHandler } from "./commons/middlewares/error-handler";

export class App {
  private readonly app: express.Application;
  private readonly server: http.Server;
  private controllers: Controller[];

  constructor(controllers: Controller[]) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.controllers = controllers;
  }

  public async start(): Promise<http.Server> {
    this.configureExpress();
    this.configureRoutes();
    return this.server;
  }

  public getApp(): express.Application {
    return this.app;
  }

  private configureExpress(): void {
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: "50mb" }));

    // ✅ CORS
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"],
      })
    );

    // Pino HTTP middleware with structured logs
    this.app.use(
      pinoHttp({
        autoLogging: true,
        customLogLevel: (res, err) => {
          if (err) return "error";
          if (res?.statusCode) {
            if (res.statusCode >= 500) return "error";
            if (res.statusCode >= 400) return "warn";
          }
          return "info";
        },
      })
    );

    this.app.use(requestIp.mw());
    this.app.use(compression());

    // i18n initialization
    this.configureI18n();
  }

  private configureI18n(): void {
    const lang = LANG_LIST;
    i18n.configure({
      locales: [lang.Ar, lang.En],
      directory: path.join(__dirname, "../locales"),
      defaultLocale: lang.En,
      autoReload: false,
      updateFiles: false,
      syncFiles: false,
      objectNotation: true,
    });

    this.app.use(i18n.init);

    this.app.all("/*", (req, res, next) => {
      const accept = req.get("accept-language") || lang.En;
      req.setLocale(accept);
      res.header("Content-Type", "application/json; charset=utf-8");
      next();
    });
  }

  private configureRoutes(): void {
    const storagePath = process.env.PUBLIC_STORAGE_PATH
      ? path.resolve(process.env.PUBLIC_STORAGE_PATH)
      : "./public";
    this.app.use("/public", express.static(storagePath));

    this.app.get("/", (req, res) => {
      res.send({ message: "Welcome to PEAKPROZ" });
    });

    this.initializeControllers(this.controllers);

    // Global error handler
    this.app.use(globalErrorHandler);
  }

  private async initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(
        `/api/v1${controller.path}`,
        controller.middleware || [],
        controller.router
      );
    });
  }
}

export default App;
