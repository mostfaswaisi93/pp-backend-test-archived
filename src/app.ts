import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import i18n from "i18n";
import expressPino from "express-pino-logger";
import { Logger } from "../src/commons/libs/logger";
import Controller from "../src/interfaces/controller.interface";

const logger = Logger.Instance.log();

export class App {
  private readonly app: express.Application;
  private readonly server: http.Server;
  private controllers: Controller[];

  constructor(_controllers: Controller[]) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.controllers = _controllers;
  }

  public async start(): Promise<http.Server> {
    this.expressConfiguration();
    this.configurationRouter();
    return this.server;
  }

  public getApp(): express.Application {
    return this.app;
  }

  private expressConfiguration(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(cors());
    this.initI18n();
  }

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
    const storagePath = process.env.PUBLIC_STORAGE_PATH
      ? path.resolve(process.env.PUBLIC_STORAGE_PATH)
      : "./public";
    this.app.use("/public", express.static(storagePath));

    this.app.get("/", (req, res) => {
      res.send({ message: "Welcome to PEAKPROZ" });
    });

    this.initializeControllers(this.controllers);

    this.app.use((req, res, next) => {
      res.status(404).json({ error: "Not found" });
      logger.error(
        `Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      next();
    });

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
      this.app.use(
        `/portal/api/v1${controller.path}`,
        controller.middleware || [],
        controller.router
      );
    });
  }
}

export default App;
