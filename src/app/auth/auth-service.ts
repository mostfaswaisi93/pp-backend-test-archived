import * as crypto from "crypto";
import { getRepository } from "typeorm";
import { User } from "../../database/entity/User";
import {
	InvalidEmailOrPasswordException,
	InvalidInputException,
	SMTPException,
	UserNotFoundException,
} from "../../commons/errors/exceptions";
import { AccountNotVerifiedException } from "../../commons/errors/exceptions";
import AccessTokenService from "./access-token-service";
import * as Chance from "chance";
import * as passport from "passport";
import * as i18n from "i18n";
import { MailService } from "../../commons/services/MailService";
import { PasswordCheckService } from "../../commons/validators/PasswordCheckService";
import * as svgCaptcha from "svg-captcha";
import { UserService } from "../user/UserService";
import { USER_TYPES } from "../../commons/constants/constants";
export default class AuthService {
	private userRepository = getRepository(User);
	private accessTokenService = AccessTokenService.Instance;
	private mailService: MailService = MailService.Instance;
	private passwordCheckService: PasswordCheckService =
		PasswordCheckService.Instance;
	private userTypes = USER_TYPES;

	private static _instance: AuthService;

	static get Instance() {
		return this._instance ? this._instance : (this._instance = new this());
	}

	constructor() {}

	async login(email, password) {
		if (!email || !password) {
			throw new InvalidEmailOrPasswordException();
		}

		let user = await this.userRepository.findOne(
			{
				email: email.trim().toLowerCase(),
			},
			{ relations: ["agency"] }
		);
		if (!user) {
			throw new InvalidEmailOrPasswordException();
		} else if (user.active === 2 || (user.agency && user.agency.active === 2)) {
			throw new AccountNotVerifiedException();
		} else {
			if (this.validPassword(password, user.password)) {
				let accessToken = this.accessTokenService.createToken(user);
				return { user, accessToken };
			} else {
				throw new InvalidEmailOrPasswordException();
			}
		}
	}

	async logout(accessToken): Promise<any> {
		return this.accessTokenService.deleteToken(accessToken);
	}

	authenticate = (req, res, next) => {
		passport.authenticate(
			"bearer",
			{ session: false },
			function (err, result, info) {
				if (err || result === false) {
					return res.status(401).send({
						code: 401,
						message: i18n.__("token_not_valid"),
					});
				}

				req.user = {
					userId: result.payload.userId,
					userType: result.payload.userType,
					name: result.payload.name,
					token: result.token,
				};
				next();
			}
		)(req, res, next);
	};

	async resetPasswordcheckverificationCode(verificationCode) {
		if (!verificationCode) {
			throw new InvalidInputException(i18n.__("verificationCode_is_required"));
		}

		let user = await this.userRepository.findOne({
			verificationCode,
			active: 1,
		});
		if (user) {
			return user;
		} else {
			throw new InvalidInputException(i18n.__("verificationCode_not_valid"));
		}
	}

	async resetPassword(verificationCode, password) {
		if (password) {
			if (!this.passwordCheckService.checkPasswordValidaty(password)) {
				throw new InvalidInputException(i18n.__("complex_password_required"));
			}
		} else {
			throw new Error(i18n.__("password_required"));
		}

		let user: User;

		try {
			user = await this.resetPasswordcheckverificationCode(verificationCode);
			user.password = password;
			user.verificationCode = null;
		} catch (error) {
			throw new InvalidInputException(i18n.__("verificationCode_not_valid"));
		}

		await this.resetPasswordSendEmail(user);
		return await this.userRepository.save(user);
	}

	async forgetPassword(email) {
		let user = await this.userRepository.findOne({
			email: email.trim().toLowerCase(),
			active: 1,
		});
		if (user) {
			user.toJSON();
			user.verificationCode = this.generateVerificationCode();
			user = await this.userRepository.save(user);
			await this.forgetPasswordSendEmail(user);
			return true;
		} else {
			throw new InvalidInputException(i18n.__("email_not_exist"));
		}
	}

	forgetPasswordSendEmail = async (user: User) => {
		let verificationCode = user.verificationCode;
		user = user.toJSON();
		const mailInfo = {
			to: user.email,
			subject: "NCSI - Forgot Password",
			template: "forgot-password",
			context: { user, verificationCode },
			attachments: [],
		};
		try {
			await this.mailService.sendMail(mailInfo);
		} catch (error) {
			throw new SMTPException(error.message);
		}
	};

	resetPasswordSendEmail = async (user) => {
		const mailInfo = {
			to: user.email,
			subject: "NCSI - Reset Password",
			template: "reset-password",
			context: { user },
			attachments: [],
		};
		try {
			await this.mailService.sendMail(mailInfo);
		} catch (error) {
			throw new SMTPException(error.message);
		}
	};

	generateVerificationCode() {
		return this.pickUpVerifcationCode(this.generateCode(), 5);
	}

	generateCode() {
		return (
			new Date().getUTCMilliseconds() +
			Math.floor(Math.random() * Math.floor(Math.pow(10, 6)))
		);
	}

	pickUpVerifcationCode(generatedCode, length) {
		let result = "";
		let randomChars = "0123456789";
		for (let i = 0; i < length; i++) {
			result += randomChars.charAt(generatedCode.toString().charAt(i) || 0);
		}
		return result;
	}

	setPassword = (password) => {
		const salt = "e!uAg+-C!3xTkT9F";
		return crypto
			.pbkdf2Sync(password, salt, 10000, 64, `sha512`)
			.toString(`hex`);
	};

	validPassword = (password, dbHash) => {
		const salt = "e!uAg+-C!3xTkT9F";
		let hash = crypto
			.pbkdf2Sync(password, salt, 10000, 64, `sha512`)
			.toString(`hex`);
		return dbHash === hash;
	};

	generateCaptcha = async () => {
		let captcha = await svgCaptcha.create({
			color: true,
			background: "#8292ab",
			size: 5,
		});
		return captcha;
	};

	isAdmin = (req, res, next) => {
		if (req.user.userType === this.userTypes.Admin) {
			next();
		} else {
			res.status(401).send({
				code: 401,
				message: i18n.__("unauthorized_access"),
			});
		}
	};
}
