import User from "../../models/user/user.model";
import { Logger } from "../../commons/libs/logger";
import { ActionLog } from "../../models/action-log/action-log.model";
import { ACTION_LOG_REF_TYPE, ACTION_LOG_TYPE } from "../constants/constants";
import { ActionLogType } from "../../models/action-log-type/action-log-type.model";

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
    userId: string,
    actionRefType: ACTION_LOG_REF_TYPE | null = null,
    actionRefId: number | null = null
  ): Promise<void> {
    try {
      const logType = await ActionLogType.findOne({
        where: { id: actionType },
      });
      if (!logType) throw new Error("Invalid log type");

      let messege: string | null = logType.logMessege;
      let user = await User.findOne({ _id: userId }); // Use _id instead of userId
      input["firstName"] = user?.firstName ?? "Default Name"; // Ensure firstName is not null or undefined
      if (messege === null) {
        throw new Error("Log message cannot be null");
      }

      for (let key in input) {
        messege = messege.replace("{" + key + "}", input[key].toString());
      }

      const newLog = new ActionLog({
        logMessege: messege,
        actionLogTypeId: actionType,
        logRefType: actionRefType,
        logRefId: actionRefId,
        userId,
      });

      await newLog.save();
      this.logger.info(`Action log inserted: ${messege}`);
    } catch (error: any) {
      // this.logger.error("Error inserting action log", error);
      this.logger.error("Error inserting action log");
    }
  }
}
