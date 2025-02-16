import app from "../src/server";
import http from "http";
import debugLib from "debug";
import connectDb from "../src/config/database";

const debug = debugLib("backend:server");

// PORT
const PORT = process.env.PORT || 8000;
app.set("port", PORT);

// Server
const server = http.createServer(app);

// DB connection
connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
  server.on("error", onError);
});

// Error Exception
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
