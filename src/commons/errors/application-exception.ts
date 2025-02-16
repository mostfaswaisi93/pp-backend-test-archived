import * as i18n from "i18n";

export default class ApplicationException extends Error {
  status;
  code;
  constructor(message, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong. Please try again.';
    this.status = status || 500;
    this.code = 0;
  }
}