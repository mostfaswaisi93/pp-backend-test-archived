import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import requestIp from "request-ip";
import compression from "compression";
import http from "http";
import path from "path";
import i18n from "i18n";
import { Logger } from "../src/commons/libs/logger";
import Controller from "../src/interfaces/controller.interface";
import { errorHandler } from "./middlewares/exception";
import JwtBearer from "./app/auth/jwt-bearer";

const logger = Logger.Instance.log();

export class App {
  private readonly app: express.Application;
  private readonly server: http.Server;
  private controllers: Controller[];

  constructor(controllers: Controller[]) {
    console.log("Initializing App...");
    this.app = express();
    this.server = http.createServer(this.app);
    this.controllers = controllers;
    console.log(this.controllers, "rr App...");
  }

  public async start(): Promise<http.Server> {
    console.log("Starting app...");
    this.expressConfiguration();
    this.configurationRouter();
    return this.server;
  }

  // public async start(): Promise<void> {
  //   console.log("Starting app...");
  //   this.expressConfiguration();
  //   this.configurationRouter();
  // }

  public getApp(): express.Application {
    return this.app;
  }

  private expressConfiguration(): void {
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: "50mb" }));

    // CORS and headers setup
    this.app.use((req, res, next): void => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, Content-Type, Authorization"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,PATCH,POST,DELETE,OPTIONS"
      );
      next();
    });

    // Logging
    this.app.use(morgan("combined"));
    this.app.use(cors());

    // Request IP middleware
    this.app.use(requestIp.mw());

    // Compression middleware
    this.app.use(compression());

    // this.configureJwt();

    // Error handling middleware
    this.app.use(errorHandler);

    // Initialize i18n localization
    this.initI18n();
  }

  // private configureJwt() {
  //   this.app.use(JwtBearer.Instance.bearerAuth);
  // }

  private initI18n() {
    i18n.configure({
      locales: ["ar", "en"],
      directory: path.join(__dirname, "../../locales"),
      defaultLocale: "en",
      objectNotation: true,
    });

    this.app.use(i18n.init);

    this.app.all("/*", (req, res, next) => {
      const accept = req.get("accept-language") || "en";
      i18n.setLocale(req, accept);
      res.header("Content-Type", "application/json; charset=utf-8");
      next();
    });
  }

  private configurationRouter(): void {
    // Serving static files
    const storagePath = process.env.PUBLIC_STORAGE_PATH
      ? path.resolve(process.env.PUBLIC_STORAGE_PATH)
      : "./public";
    this.app.use("/public", express.static(storagePath));

    // Default route
    this.app.get("/", (req, res) => {
      res.send({ message: "Welcome to PEAKPROZ" });
    });

    // Initialize controllers
    this.initializeControllers(this.controllers);

    // 404 route handler
    this.app.use((req, res, next) => {
      res.status(404).json({ error: "Not found" });
      logger.error(
        `Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      next();
    });

    // Global error handler
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
        logger.error(
          `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
        res.status(err.status || 500).send({ message: err.message });
      }
    );
  }

  private async initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      console.log(`Registering route: /api/v1${controller.path}`);
      this.app.use(
        `/api/v1${controller.path}`,
        controller.middleware || [],
        controller.router
      );
    });
  }
}

export default App;
