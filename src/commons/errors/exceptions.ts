import i18n from "i18n";
import { BaseException } from "./base-exception";

// 400 Bad Request
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
  constructor(messageKey: string = i18n.__("item_already_exists")) {
    super(messageKey, 400, i18n.__("item_already_exists"));
  }
}

export class AccountBlockedException extends BaseException {
  constructor(messageKey: string = i18n.__("account_blocked")) {
    super(messageKey, 400, i18n.__("account_blocked"));
  }
}

// 401 Unauthorized
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

// 404 Not Found
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

// 500 Internal Server Error
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
