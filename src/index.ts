import * as dotenv from "dotenv";
import { resolve } from "path";
import { server } from "../src/server";
import { bootstrap } from "../src/bootstrap";
import * as controllers from "../src/app";
import Controller from "../src/interfaces/controller.interface";

dotenv.config({ path: resolve() + "/.env" });

const port: number = Number(process.env.SERVER_PORT) || 8000;

let controllersArray: Controller[] = [];

bootstrap().then(async (_connection) => {
  Object.keys(controllers).forEach((key) => {
    const ControllerClass = (<any>controllers)[key];
    controllersArray.push(new ControllerClass());
  });

  // تهيئة السيرفر
  const server = new Server(controllersArray);
  try {
    await server.start();
    server.listen(port);
    server.on("error", (error: any) => {
      if (error.syscall !== "listen") {
        throw error;
      }
      switch (error.code) {
        case "EACCES":
          console.error("Port requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error("Port is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    server.on("listening", () => {
      console.log(
        `Server is running in process ${process.pid} listening on PORT ${port}\n`
      );
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
});
