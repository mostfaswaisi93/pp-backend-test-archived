import * as fs from "fs";
import * as path from "path";

export const JWT_CONFIG = {
  PUB_KEY: fs.readFileSync(
    path.join(__dirname, "../../../id_rsa_pub.pem"),
    "utf8"
  ),
  PRIV_KEY: fs.readFileSync(
    path.join(__dirname, "../../../id_rsa_priv.pem"),
    "utf8"
  ),
  ALGORITHM: "RS256",
  TTL: 60 * 60 * 24, // one day
};
