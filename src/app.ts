import cors from "cors";
import http from "http";
import path from "path";
import i18n from "i18n";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import requestIp from "request-ip";
import compression from "compression";
import { Logger } from "../src/commons/libs/logger";
import { LANG_LIST } from "./commons/constants/constants";
import { errorHandler } from "./commons/middlewares/exception";
import Controller from "../src/interfaces/controller.interface";

const logger = Logger.Instance.log();

export class App {
  private readonly app: express.Application;
  private readonly server: http.Server;
  private controllers: Controller[];

  constructor(controllers: Controller[]) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.controllers = controllers;
  }

  // Start the app
  public async start(): Promise<http.Server> {
    this.configureExpress();
    this.configureRoutes();
    return this.server;
  }

  // Get Express app instance
  public getApp(): express.Application {
    return this.app;
  }

  // Configure express middleware
  private configureExpress(): void {
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: "50mb" }));

    // CORS and headers setup
    this.app.use((request, response, next): void => {
      response.header("Access-Control-Allow-Origin", "*");
      response.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, Content-Type, Authorization"
      );
      response.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,PATCH,POST,DELETE,OPTIONS"
      );
      next();
    });

    this.app.use(morgan("combined"));
    this.app.use(cors());

    // IP logging middleware
    this.app.use(requestIp.mw());

    // Request compression middleware
    this.app.use(compression());

    // Error handling middleware
    this.app.use(errorHandler);

    // Initialize i18n for localization
    this.configureI18n();
  }

  // Configure i18n for localization
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

    // Set locale based on request header
    this.app.all("/*", (request, response, next) => {
      const accept = request.get("accept-language") || lang.En;
      request.setLocale(accept);
      response.header("Content-Type", "application/json; charset=utf-8");
      next();
    });
  }

  // Configure routes
  private configureRoutes(): void {
    const storagePath = process.env.PUBLIC_STORAGE_PATH
      ? path.resolve(process.env.PUBLIC_STORAGE_PATH)
      : "./public";
    this.app.use("/public", express.static(storagePath));

    // Default root route
    this.app.get("/", (request, response) => {
      response.send({ message: "Welcome to PEAKPROZ" });
    });

    // Register controllers and their routes
    this.initializeControllers(this.controllers);

    // 404 route handler
    this.app.use((request, response, next) => {
      response.status(404).json({ error: "Not found" });
      logger.error(
        `Not Found - ${request.originalUrl} - ${request.method} - ${request.ip}`
      );
      next();
    });

    // Global error handler
    this.app.use(this.globalErrorHandler);
  }

  // Initialize controllers by adding their routes to the app
  private async initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(
        `/api/v1${controller.path}`,
        controller.middleware || [],
        controller.router
      );
    });
  }

  // Global error handler for unhandled exceptions
  private globalErrorHandler(
    error: any,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): void {
    response.locals.message = error.message;
    response.locals.error = process.env.NODE_ENV !== "production" ? error : {};
    logger.error(
      `${error.status || 500} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`
    );
    response.status(error.status || 500).send({ message: error.message });
  }
}

export default App;
