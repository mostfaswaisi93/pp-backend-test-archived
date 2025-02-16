import * as i18n from "i18n";
import ApplicationException from "./application-exception";

export class InvalidInputException extends ApplicationException {
	constructor(message?) {
		super(message || i18n.__("invalid_input"), 400);
		Object.setPrototypeOf(this, InvalidInputException.prototype);
	}
}

export class InvalidEmailOrPasswordException extends ApplicationException {
	constructor(message?) {
		super(message || i18n.__("invalid_email_or_password"), 400);
		Object.setPrototypeOf(this, InvalidEmailOrPasswordException.prototype);
	}
}

export class AccountNotVerifiedException extends ApplicationException {
	constructor(message?) {
		super(message || i18n.__("account_not_verified"), 400);
		Object.setPrototypeOf(this, AccountNotVerifiedException.prototype);
	}
}

export class UnauthorizedException extends ApplicationException {
	constructor(message?) {
		super(message || i18n.__("unauthorized_access"), 401);
		Object.setPrototypeOf(this, UnauthorizedException.prototype);
	}
}

export class AlreadyExistException extends ApplicationException {
	constructor(message?) {
		super(message || i18n.__("item_already_exist"), 400);
		Object.setPrototypeOf(this, AlreadyExistException.prototype);
	}
}

export class TokenNotValidException extends ApplicationException {
	constructor(message?) {
		super(message || i18n.__("token_not_valid"), 401);
		Object.setPrototypeOf(this, TokenNotValidException.prototype);
	}
}

export class UserNotFoundException extends ApplicationException {
	constructor(message?) {
		super(message || i18n.__("user_not_found"), 404);
		Object.setPrototypeOf(this, UserNotFoundException.prototype);
	}
}

export class NotFoundException extends ApplicationException {
	constructor(message?) {
		super(message || i18n.__("item_not_found"), 404);
		Object.setPrototypeOf(this, NotFoundException.prototype);
	}
}

export class AccountBlockedException extends ApplicationException {
	constructor(message) {
		super(message || i18n.__("Account is blocked"), 400);
		Object.setPrototypeOf(this, AccountBlockedException.prototype);
	}
}
export class OrdsErrorException extends ApplicationException {
	constructor(message) {
		super(message || i18n.__("ords_connection_error"), 500);
		Object.setPrototypeOf(this, OrdsErrorException.prototype);
	}
}
export class SMTPException extends ApplicationException {
	constructor(message) {
		super(i18n.__("smtp_error") + ": " + message, 500);
		Object.setPrototypeOf(this, SMTPException.prototype);
	}
}
