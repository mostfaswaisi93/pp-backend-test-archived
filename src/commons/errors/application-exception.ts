import i18n from "i18n";

export default class ApplicationException extends Error {
  status: number;
  code: number;

  constructor(messageKey?: string, status: number = 500, code: number = 0) {
    const errorMessage = messageKey?.trim() || i18n.__("something_wrong");
    super(errorMessage);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
  }
}
