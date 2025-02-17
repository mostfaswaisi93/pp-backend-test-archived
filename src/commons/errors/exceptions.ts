import i18n from "i18n";
import ApplicationException from "./application-exception";

export class BaseException extends ApplicationException {
  public errorCode: string;

  constructor(messageKey: string, status: number, errorCode: string) {
    super(i18n.__({ phrase: messageKey, locale: i18n.getLocale() }), status);
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidInputException extends BaseException {
  constructor(messageKey: string = "invalid_input") {
    super(messageKey, 400, "INVALID_INPUT");
  }
}

export class InvalidEmailOrPasswordException extends BaseException {
  constructor(messageKey: string = "invalid_email_or_password") {
    super(messageKey, 400, "INVALID_CREDENTIALS");
  }
}

export class AccountNotVerifiedException extends BaseException {
  constructor(messageKey: string = "account_not_verified") {
    super(messageKey, 400, "ACCOUNT_NOT_VERIFIED");
  }
}

export class UnauthorizedException extends BaseException {
  constructor(messageKey: string = "unauthorized_access") {
    super(messageKey, 401, "UNAUTHORIZED_ACCESS");
  }
}

export class AlreadyExistException extends BaseException {
  constructor(messageKey: string = "item_already_exist") {
    super(messageKey, 400, "ITEM_ALREADY_EXISTS");
  }
}

export class TokenNotValidException extends BaseException {
  constructor(messageKey: string = "token_not_valid") {
    super(messageKey, 401, "TOKEN_NOT_VALID");
  }
}

export class UserNotFoundException extends BaseException {
  constructor(messageKey: string = "user_not_found") {
    super(messageKey, 404, "USER_NOT_FOUND");
  }
}

export class NotFoundException extends BaseException {
  constructor(messageKey: string = "item_not_found") {
    super(messageKey, 404, "ITEM_NOT_FOUND");
  }
}

export class AccountBlockedException extends BaseException {
  constructor(messageKey: string = "account_blocked") {
    super(messageKey, 400, "ACCOUNT_BLOCKED");
  }
}

export class OrdsErrorException extends BaseException {
  constructor(messageKey: string = "ords_connection_error") {
    super(messageKey, 500, "ORDS_ERROR");
  }
}

export class SMTPException extends BaseException {
  constructor(message: string) {
    super("smtp_error", 500, "SMTP_ERROR");
    this.message = `${i18n.__("smtp_error")}: ${message}`;
  }
}
