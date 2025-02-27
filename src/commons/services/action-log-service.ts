import { Logger } from "../../commons/libs/logger";
import { ACTION_LOG_REF_TYPE, ACTION_LOG_TYPE } from "../constants/constants";
import { UserModel } from "../../database/models/User";
import { ActionLogModel } from "../../database/models/ActionLog";
import { ActionLogTypeModel } from "../../database/models/ActionLogType";

export class ActionLogService {
  private static _instance: ActionLogService;
  private logger: Logger = Logger.Instance;

  private constructor() {}

  public static getInstance(): ActionLogService {
    if (!this._instance) {
      this._instance = new ActionLogService();
    }
    return this._instance;
  }

  public async insertAction(
    actionType: ACTION_LOG_TYPE,
    input: Record<string, string | number | boolean>,
    userId: number,
    actionRefType: ACTION_LOG_REF_TYPE | null = null,
    actionRefId: number | null = null
  ): Promise<void> {
    try {
      const logType = await ActionLogTypeModel.findById(actionType);
      if (!logType) throw new Error("Invalid log type");

      const user = await UserModel.findOne({ userId });
      if (!user) throw new Error("User not found");

      let logMessage = logType.logMessage;
      input["name"] = user.nameEn;
      logMessage = Object.keys(input).reduce(
        (msg, key) => msg.replace(`{${key}}`, String(input[key])),
        logMessage
      );

      const newLog = new ActionLogModel({
        logMessage,
        actionLogTypeId: actionType,
        logRefType: actionRefType,
        logRefId: actionRefId,
        userId,
      });

      await newLog.save();
      this.logger.info(`Action log inserted: ${logMessage}`);
    } catch (error) {
      this.logger.error("Error inserting action log", error);
    }
  }
}
