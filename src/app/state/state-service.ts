import { Logger } from "../../commons/libs/logger";
import { State } from "../../models/state/state.model";
import { IState } from "../../models/state/state.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

const logger = Logger.Instance;

export class StateService {
  private static _instance: StateService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  public async create(data: Partial<IState>) {
    try {
      if (!data.stateCode || !data.countryCode || !data.stateName) {
        logger.warn("Missing required fields for state creation", { data });
        throw new InvalidInputException("Missing required fields");
      }

      const stateExist = await State.findOne({
        stateCode: data.stateCode,
        countryCode: data.countryCode,
      });

      if (stateExist) {
        logger.warn("Attempt to create existing state", {
          countryCode: data.countryCode,
          stateCode: data.stateCode,
        });
        throw new InvalidInputException(
          "State already exists for this country"
        );
      }

      const state = new State({
        countryCode: data.countryCode,
        stateCode: data.stateCode,
        stateName: data.stateName,
        status: data.status ?? "ACTIVE",
      });

      const result = await state.save();
      logger.info("State created successfully", { state: result });
      return result;
    } catch (error: any) {
      logger.error("Failed to create state", { error, data });
      throw error;
    }
  }

  public async getStateById(_id: string) {
    try {
      const state = await State.findById({ _id });
      if (!state) {
        logger.warn("State not found by ID", { _id });
        throw new InvalidInputException("State not found");
      }
      logger.info("State retrieved by ID", { _id, state });
      return state;
    } catch (error: any) {
      logger.error("Failed to get state by ID", { error, _id });
      throw error;
    }
  }

  public async getStates(status?: string, fields?: string) {
    try {
      const filter = status ? { status } : {};
      const projection = fields ? fields.split(",").join(" ") : "";

      const states = await State.find(filter, projection).sort({
        stateName: 1,
      });

      if (states.length === 0) {
        logger.warn("No states found", { status, fields });
        throw new InvalidInputException("States not found");
      }

      logger.info("States retrieved", { count: states.length });
      return states;
    } catch (error: any) {
      logger.error("Failed to get states", { error, status, fields });
      throw error;
    }
  }

  public async getZipcodeByStateCode(stateCode: string) {
    try {
      const states = await State.find({ stateCode });
      if (!states || states.length === 0) {
        throw new NotFoundException("Zipcode State Not Found");
      }
      return states;
    } catch (error: any) {
      logger.error("Failed to fetch zipcodes by stateCode", {
        error,
        stateCode,
      });
      throw error;
    }
  }

  public async update(_id: string, data: Partial<IState>) {
    try {
      const state = await State.findById(_id);
      if (!state) {
        logger.warn("State not found for update", { _id });
        throw new NotFoundException("State not found");
      }

      if (
        data.stateCode &&
        data.countryCode &&
        (data.stateCode !== state.stateCode ||
          data.countryCode !== state.countryCode)
      ) {
        const stateExist = await State.findOne({
          stateCode: data.stateCode,
          countryCode: data.countryCode,
          _id: { $ne: _id },
        });

        if (stateExist) {
          logger.warn("Attempt to update state to existing code", {
            _id,
            countryCode: data.countryCode,
            stateCode: data.stateCode,
          });
          throw new InvalidInputException(
            "State already exists for this country"
          );
        }
      }

      state.countryCode = data.countryCode ?? state.countryCode;
      state.stateCode = data.stateCode ?? state.stateCode;
      state.stateName = data.stateName ?? state.stateName;
      state.status = data.status ?? state.status;

      const updatedState = await state.save();
      logger.info("State updated successfully", { _id, updatedState });
      return updatedState;
    } catch (error: any) {
      logger.error("Failed to update state", { error, _id, data });
      throw error;
    }
  }

  public async updateStatus(_id: string, data: Partial<IState>) {
    try {
      const state = await State.findById(_id);
      if (!state) {
        logger.warn("State not found for status update", { _id });
        throw new NotFoundException();
      }

      const updatedStatus = await State.findByIdAndUpdate(
        _id,
        { $set: { status: data.status || state.status } },
        { new: true }
      );

      if (!updatedStatus) {
        logger.warn("State not found after status update attempt", { _id });
        throw new InvalidInputException("State not found");
      }

      logger.info("State status updated successfully", { _id, updatedStatus });
      return updatedStatus;
    } catch (error: any) {
      logger.error("Failed to update state status", { error, _id, data });
      throw error;
    }
  }

  public async delete(_id: string) {
    try {
      const state = await State.findByIdAndDelete({ _id });
      if (!state) {
        logger.warn("State not found for deletion", { _id });
        throw new InvalidInputException("State not found");
      }
      logger.info("State deleted successfully", { _id, state });
      return state;
    } catch (error: any) {
      logger.error("Failed to delete state", { error, _id });
      throw error;
    }
  }
}
