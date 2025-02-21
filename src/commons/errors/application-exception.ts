import i18n from "i18n";

export default class ApplicationException extends Error {
  public readonly status: number;
  public readonly code: number;

  constructor(
    messageKey: string = "errors.default",
    status: number = 500,
    code: number = 0
  ) {
    const message = i18n.__({ phrase: messageKey, locale: i18n.getLocale() });
    super(message);

    Object.setPrototypeOf(this, ApplicationException.prototype);

    this.name = "ApplicationException";
    this.status = status;
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationException);
    }
  }
}
