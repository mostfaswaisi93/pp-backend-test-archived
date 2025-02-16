import { Logger } from "../libs/logger";
import ApplicationException from "../errors/application-exception";

export default class HttpResWrapper {
  private static _instance;

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  public success = (res, obj = null) => {
    if (obj) {
      res.status(200).send(obj);
    } else {
      res.status(200).send();
    }
  };

  public error = (res, error) => {
    if (typeof error === "object" && error instanceof ApplicationException) {
      new Logger().log().warn(error);
      res.status(error.status).send({
        code: error.code,
        message: error.message,
      });
    } else {
      new Logger().log().error(error);
      res.status(500).send({
        code: 500,
        message: error.message,
      });
    }
  };

  public handle = function (status, error, res) {
    if (status === 500) {
      new Logger().log().error(error);
    }

    res.status(status).send(error);
  };
}
