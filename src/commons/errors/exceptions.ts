import i18n from "i18n";
import ApplicationException from "./application-exception";

export class BaseException extends ApplicationException {
  public readonly errorCode: string;

  constructor(messageKey: string, status: number, errorCode: string) {
    super(messageKey, status);
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 🔹 400 Bad Request Exceptions
export class InvalidInputException extends BaseException {
  constructor(messageKey: string = i18n.__("invalid_input")) {
    super(messageKey, 400, i18n.__("invalid_input"));
  }
}

export class InvalidEmailOrPasswordException extends BaseException {
  constructor(messageKey: string = i18n.__("invalid_email_or_password")) {
    super(messageKey, 400, i18n.__("invalid_email_or_password"));
  }
}

export class AccountNotVerifiedException extends BaseException {
  constructor(messageKey: string = i18n.__("account_not_verified")) {
    super(messageKey, 400, i18n.__("account_not_verified"));
  }
}

export class AlreadyExistException extends BaseException {
  constructor(messageKey: string = i18n.__("item_already_exist")) {
    super(messageKey, 400, i18n.__("item_already_exist"));
  }
}

export class AccountBlockedException extends BaseException {
  constructor(messageKey: string = i18n.__("account_blocked")) {
    super(messageKey, 400, i18n.__("account_blocked"));
  }
}

// 🔹 401 Unauthorized Exceptions
export class UnauthorizedException extends BaseException {
  constructor(messageKey: string = i18n.__("unauthorized_access")) {
    super(messageKey, 401, i18n.__("unauthorized_access"));
  }
}

export class TokenNotValidException extends BaseException {
  constructor(messageKey: string = i18n.__("token_not_valid")) {
    super(messageKey, 401, i18n.__("token_not_valid"));
  }
}

// 🔹 404 Not Found Exceptions
export class UserNotFoundException extends BaseException {
  constructor(messageKey: string = i18n.__("user_not_found")) {
    super(messageKey, 404, i18n.__("user_not_found"));
  }
}

export class NotFoundException extends BaseException {
  constructor(messageKey: string = i18n.__("item_not_found")) {
    super(messageKey, 404, i18n.__("item_not_found"));
  }
}

// 🔹 500 Internal Server Error Exceptions
export class OrdsErrorException extends BaseException {
  constructor(messageKey: string = i18n.__("ords_connection_error")) {
    super(messageKey, 500, i18n.__("ords_connection_error"));
  }
}

export class SMTPException extends BaseException {
  constructor(message: string) {
    super("smtp_error", 500, i18n.__("smtp_error"));
    Object.setPrototypeOf(this, new.target.prototype);
    this.message = `${i18n.__("smtp_error")}: ${message}`;
  }
}
