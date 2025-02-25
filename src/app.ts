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

// Logger instance
const logger = Logger.Instance.log();

export class App {
  private readonly app: express.Application;
  private readonly server: http.Server;
  private controllers: Controller[];

  constructor(controllers: Controller[]) {
    // console.log("Initializing App...");
    this.app = express();
    this.server = http.createServer(this.app);
    this.controllers = controllers;
  }

  // Start the app
  public async start(): Promise<http.Server> {
    // console.log("Starting app...");
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
    this.app.use(helmet()); // Security middleware
    this.app.use(express.urlencoded({ extended: true })); // Body parsing
    this.app.use(express.json({ limit: "50mb" })); // JSON body parsing

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

    // Middleware for logging requests
    this.app.use(morgan("combined"));
    this.app.use(cors());

    // IP logging middleware
    this.app.use(requestIp.mw());

    // Request compression middleware
    this.app.use(compression());

    // Initialize Jwt
    // this.configureJwt();

    // Error handling middleware
    this.app.use(errorHandler);

    // Initialize i18n for localization
    this.configureI18n();
  }

  // private configureJwt() {
  //   this.app.use(JwtBearer.Instance.bearerAuth);
  // }

  // Configure i18n for localization
  private configureI18n(): void {
    i18n.configure({
      locales: ["ar", "en"],
      directory: path.join(__dirname, "../locales"),
      defaultLocale: "en",
      objectNotation: true,
    });

    this.app.use(i18n.init);

    // Set locale based on request header
    this.app.all("/*", (req, res, next) => {
      const accept = req.get("accept-language") || "en";
      i18n.setLocale(req, accept);
      res.header("Content-Type", "application/json; charset=utf-8");
      next();
    });
  }

  // Configure routes
  private configureRoutes(): void {
    // Static file serving (e.g., images, documents)
    const storagePath = process.env.PUBLIC_STORAGE_PATH
      ? path.resolve(process.env.PUBLIC_STORAGE_PATH)
      : "./public";
    this.app.use("/public", express.static(storagePath));

    // Default root route
    this.app.get("/", (req, res) => {
      res.send({ message: "Welcome to PEAKPROZ" });
    });

    // Register controllers and their routes
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
    this.app.use(this.globalErrorHandler);
  }

  // Initialize controllers by adding their routes to the app
  private async initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      // console.log(`Registering route: /api/v1${controller.path}`);
      this.app.use(
        `/api/v1${controller.path}`,
        controller.middleware || [],
        controller.router
      );
    });
  }

  // Global error handler for unhandled exceptions
  private globalErrorHandler(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    logger.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    res.status(err.status || 500).send({ message: err.message });
  }
}

export default App;
