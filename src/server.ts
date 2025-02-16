import http from "http";
import debugLib from "debug";
import app from "../src/app";
import connectDb from "./config/database";

const debug = debugLib("backend:server");

// PORT `.env` 8000
const PORT = process.env.PORT || 8000;
app.set("port", PORT);

// Server
const server = http.createServer(app);

// DB Connection
connectDb()
  .then(() => {
    server.listen(PORT, () => {
      debug(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    server.on("error", onError);
    server.on("listening", onListening);
  })
  .catch((error) => {
    debug("❌ Database connection failed:", error);
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

// Error Exception
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Listening on PORT `.env` 8000
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
  debug(`✅ Listening on ${bind}`);
  console.log(`✅ Listening on ${bind}`);
}

export default server;
