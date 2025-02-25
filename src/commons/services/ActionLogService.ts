import { getRepository, In, Not } from "typeorm";
import { Logger } from "../../commons/libs/logger";
import { ACTION_LOG_REF_TYPE, ACTION_LOG_TYPE } from "../constants/constants";
import { User } from "../../database/entity/User";
import { ActionLog } from "../../database/entity/ActionLog";
import { ActionLogType } from "../../database/entity/ActionLogType";

export class ActionLogService {
	private actionLogRepository = getRepository(ActionLog);
	private actionLogTypeRepository = getRepository(ActionLogType);

	private logger: Logger = Logger.Instance;

	private static _instance;

	static get Instance() {
		return this._instance ? this._instance : (this._instance = new this());
	}

	async insertAction(
		actionType: ACTION_LOG_TYPE,
		input: { [key: string]: string | number | boolean },
		userId: number,
		actionRefType: ACTION_LOG_REF_TYPE = null,
		actionRefId: number = null
	) {
		try {
			let logType = await this.actionLogTypeRepository.findOne({
				where: { id: actionType },
			});
			if (!logType) throw new Error("invalid log Type");

			let messege = logType.logMessege;
			let user = await getRepository(User).findOne({ where: { userId } });
			input["name"] = user.nameEn;
			for (let key in input) {
				messege = messege.replace("{" + key + "}", input[key].toString());
			}
			let newLog = new ActionLog();
			newLog.logMessege = messege;
			newLog.actionLogTypeId = actionType;
			newLog.logRefType = actionRefType;
			newLog.logRefId = actionRefId;
			newLog.userId = userId;
			await this.actionLogRepository.save(newLog);
		} catch (error) {
			this.logger.log().info("insert action log" + error);
		}
	}
}
