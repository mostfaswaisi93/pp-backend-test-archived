import i18n from "i18n";

export default class ApplicationException extends Error {
  public status: number;
  public code: number;

  constructor(
    messageKey: string = "errors.default",
    status: number = 500,
    code: number = 0
  ) {
    super(i18n.__({ phrase: messageKey, locale: i18n.getLocale() }));

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;

    this.status = status;
    this.code = code;
  }
}
