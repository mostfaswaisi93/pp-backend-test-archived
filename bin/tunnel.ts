import localtunnel, { Tunnel } from "localtunnel";
import path from "path";
import dotenv from "dotenv";

// .env
dotenv.config({ path: path.join(".env") });

// MONGO_URL
if (!process.env.MONGO_URL) {
  throw new Error("MONGO URL NOT FOUND, PLEASE CHECK .env");
}

(async () => {
  try {
    // .env PORT 8000
    const port = process.env.PORT ?? "8000";
    console.log(`Tunneling http://localhost:${port}`);

    // Create LocalTunnel
    const tunnel: Tunnel = await localtunnel({ port });
    console.log("Tunneled URL:", tunnel.url);

    // Close Tunnel
    tunnel.on("close", () => {
      console.log("Tunnel closed!!!");
    });
  } catch (error) {
    console.error("Error in tunneling:", error);
    process.exit(1);
  }
})();
