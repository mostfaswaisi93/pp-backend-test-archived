import * as pino from 'pino';
import * as fs from 'fs';
import moment = require('moment');
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve() + "/.env" });

export class Logger {

  private static _instance;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }
  
  private path = __dirname +'/../../../logs';

  constructor(){
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
  }

  public log() {

    let stream = fs.createWriteStream(`${this.path}/access.log`, { flags: 'a' })

    const logger = pino({
      name: "ANCSI-" + process.env.NODE_ENV,
      level: 'debug',
      timestamp: () => {
        return ', "time":' + moment().format('YYYY-MM-DD hh:mm:ss');
      }
    },stream);

    return logger;

  }

}



