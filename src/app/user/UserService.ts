import {
	InvalidInputException,
	NotFoundException,
	UserNotFoundException,
} from "../../commons/errors/exceptions";
import * as i18n from "i18n";
import { getRepository, In, Not } from "typeorm";
import { User } from "../../database/entity/User";
import { PasswordCheckService } from "../../commons/validators/PasswordCheckService";
import * as fs from "fs";
import AuthService from "../auth/auth-service";
import {
	ACTION_LOG_REF_TYPE,
	ACTION_LOG_TYPE,
	ncsiID,
	USER_TYPES,
} from "../../commons/constants/constants";
import { AgencyService } from "../agency/AgencyService";
import { ActionLogService } from "../../commons/services/ActionLogService";

export class UserService {
	private ActionLogService: ActionLogService = ActionLogService.Instance;

	private userRepository = getRepository(User);
	private passwordCheckService: PasswordCheckService =
		PasswordCheckService.Instance;
	private authService: AuthService = AuthService.Instance;
	private agencyService: AgencyService = AgencyService.Instance;
	private static _instance;

	static get Instance() {
		return this._instance ? this._instance : (this._instance = new this());
	}

	async all(agencyId, withAdmin: any = false): Promise<User[]> {
		let where: any = {};
		if (agencyId && agencyId !== "null") {
			where = { agency: agencyId };
		}
		if (withAdmin === "false" || withAdmin === false) {
			where.userType = USER_TYPES.Data;
		}
		let users: User[] = await this.userRepository.find({
			where: where,
			relations: ["agency"],
		});
		return users;
	}

	async active(agencyId): Promise<User[]> {
		let where: any = { active: 1, userType: USER_TYPES.Data };
		if (agencyId && agencyId !== "null") {
			where.agency = agencyId;
		}
		let users: User[] = await this.userRepository.find({
			where: where,
			relations: ["agency"],
		});
		return users;
	}

	async ncsi(): Promise<User[]> {
		let users: User[] = await this.userRepository.find({
			where: { agency: ncsiID, active: 1, userType: USER_TYPES.Data },
			relations: ["agency"],
		});
		return users;
	}

	async findById(id): Promise<User> {
		let user = await this.userRepository.findOne({
			where: { userId: id, active: 1 },
			relations: ["agency"],
		});
		if (!user) {
			throw new UserNotFoundException();
		}
		return user;
	}

	async findByEmail(email: string): Promise<User> {
		let user = await this.userRepository.findOne({
			where: { email: email.toLowerCase().trim(), active: 1 },
			relations: ["agency"],
		});
		if (!user) {
			throw new UserNotFoundException();
		}
		return user;
	}

	async create(user: User) {
		if (user.password) {
			if (!this.passwordCheckService.checkPasswordValidaty(user.password)) {
				throw new InvalidInputException(i18n.__("complex_password_required"));
			}
		} else {
			throw new Error(i18n.__("password_required"));
		}

		if (user.email) {
			let userExist = await this.userRepository.findOne({ email: user.email });
			if (userExist) {
				throw new InvalidInputException(i18n.__("email_already_exist"));
			}
		}

		if (user.phone) {
			let userExist = await this.userRepository.findOne({ phone: user.phone });
			if (userExist) {
				throw new InvalidInputException(i18n.__("mobile_already_exist"));
			}
		}

		if (user.nameAr) {
			let userNameArExist = await this.userRepository.findOne({
				nameAr: user.nameAr,
			});
			if (userNameArExist) {
				throw new InvalidInputException(i18n.__("name_already_exist"));
			}
		}

		if (user.nameEn) {
			let userNameEnExist = await this.userRepository.findOne({
				nameEn: user.nameEn,
			});
			if (userNameEnExist) {
				throw new InvalidInputException(i18n.__("name_already_exist"));
			}
		}

		if (user.agency) {
			let agency = await this.agencyService.findById(user.agency);
			if (!agency) {
				throw new InvalidInputException(i18n.__("agency_not_found"));
			}
		}

		let createdUser: User = await this.userRepository.save(user);
		this.ActionLogService.insertAction(
			ACTION_LOG_TYPE.ADD_USER,
			{ user_name: createdUser.nameEn },
			createdUser.updatedBy,
			ACTION_LOG_REF_TYPE.USER,
			createdUser.userId
		);
		return createdUser;
	}

	async update(id, user: User) {
		let existUser = (
			await this.userRepository.findOne({ userId: id })
		).toJSON();

		if (!existUser) {
			throw new UserNotFoundException();
		}

		existUser.toJSON();

		let existEmail = await this.userRepository.findOne({
			email: user.email,
			userId: Not(id),
		});
		if (existEmail) {
			throw new InvalidInputException(i18n.__("email_already_exist"));
		}

		let existMobile = await this.userRepository.findOne({
			phone: user.phone,
			userId: Not(id),
		});
		if (existMobile) {
			throw new InvalidInputException(i18n.__("mobile_already_exist"));
		}

		if (user.nameAr) {
			let userNameArExist = await this.userRepository.findOne({
				nameAr: user.nameAr,
				userId: Not(id),
			});
			if (userNameArExist) {
				throw new InvalidInputException(i18n.__("name_already_exist"));
			}
		}

		if (user.nameEn) {
			let userNameEnExist = await this.userRepository.findOne({
				nameEn: user.nameEn,
				userId: Not(id),
			});
			if (userNameEnExist) {
				throw new InvalidInputException(i18n.__("name_already_exist"));
			}
		}

		if (user.password) {
			if (!this.passwordCheckService.checkPasswordValidaty(user.password)) {
				throw new InvalidInputException(i18n.__("complex_password_required"));
			}
		}

		if (user.agency) {
			let agency = await this.agencyService.findById(user.agency);
			if (!agency) {
				throw new InvalidInputException(i18n.__("agency_not_found"));
			}
			existUser.agency = user.agency;
		}

		existUser.nameAr = user.nameAr;
		existUser.nameEn = user.nameEn;
		existUser.phone = user.phone;
		existUser.title = user.title;

		if (user.userType) {
			existUser.userType = user.userType;
		}

		if (user.email) {
			existUser.email = user.email;
		}

		if (user.password) {
			existUser.password = user.password;
		}

		if (+user.active === 2 && +existUser.active === 1) {
			existUser.deactivateDate = new Date();
			existUser.active = user.active;
		} else if (user.active === 1) {
			existUser.deactivateDate = null;
			existUser.active = user.active;
		}

		if (user.department) {
			existUser.department = user.department;
		}

		if (user.directorGeneral) {
			existUser.directorGeneral = user.directorGeneral;
		}

		let result = await this.userRepository.save(existUser);
		this.ActionLogService.insertAction(
			ACTION_LOG_TYPE.EDIT_USER,
			{ user_name: existUser.nameEn },
			existUser.updatedBy,
			ACTION_LOG_REF_TYPE.USER,
			existUser.userId
		);
		return result;
	}

	async resetPassword(new_password, old_password, userId) {
		if (new_password) {
			if (!this.passwordCheckService.checkPasswordValidaty(new_password)) {
				throw new InvalidInputException(i18n.__("complex_password_required"));
			}
		} else {
			throw new Error(i18n.__("password_required"));
		}

		let user: User = await this.userRepository.findOne({ userId });

		if (!user) {
			throw new UserNotFoundException(i18n.__("user_not_found"));
		}

		let isValid = this.authService.validPassword(old_password, user.password);

		if (!isValid) {
			throw new InvalidInputException(i18n.__("old_password_not_correct"));
		}

		try {
			user.password = new_password;
			return await this.userRepository.save(user);
		} catch (error) {
			throw error;
		}
	}

	async updateActive(id, active, userId) {
		let user = await this.userRepository.findOne({ userId: id });

		if (!user) {
			throw new UserNotFoundException(i18n.__("user_not_found"));
		}

		if (+user.active === 1 && active === 2) {
			user.deactivateDate = new Date();
			user.active = active;
		} else if (active === 1) {
			user.deactivateDate = null;
			user.active = active;
		}
		user.updatedBy = userId;

		return await this.userRepository.save(user);
	}
}
