import { State } from "../../models/state/state.model";
import { IState } from "../../models/state/state.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class StateService {
  private static _instance: StateService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IState) {
    if (!data.stateCode || !data.countryCode || !data.stateName) {
      throw new InvalidInputException("Missing required fields");
    }

    let stateExist = await State.findOne({
      stateCode: data.stateCode,
      countryCode: data.countryCode,
    });

    if (stateExist) {
      throw new InvalidInputException("State already exists for this country");
    }

    let state = new State({
      countryCode: data.countryCode,
      stateCode: data.stateCode,
      stateName: data.stateName,
      status: data.status ?? "ACTIVE",
    });

    try {
      return await state.save();
    } catch (error) {
      throw error;
    }
  }

  public async getStateById(_id: string) {
    const state = await State.findById({ _id });
    if (!state) throw new InvalidInputException("State not found");
    return state;
  }

  public async getStates() {
    const states = await State.find({ status: "ACTIVE" }).sort({
      state: 1,
    });
    if (states.length === 0)
      throw new InvalidInputException("States not found");
    return states;
  }

  public async update(_id: string, data: IState) {
    const state = await State.findById(_id);
    if (!state) {
      throw new NotFoundException("State not found");
    }

    if (data.stateCode && data.countryCode) {
      let stateExist = await State.findOne({
        stateCode: data.stateCode,
        countryCode: data.countryCode,
        _id: { $ne: _id },
      });

      if (stateExist) {
        throw new InvalidInputException(
          "State already exists for this country"
        );
      }
    }

    let updatedState = await State.findByIdAndUpdate(
      _id,
      {
        $set: {
          countryCode: data.countryCode ?? state.countryCode,
          stateCode: data.stateCode ?? state.stateCode,
          stateName: data.stateName ?? state.stateName,
          status: data.status ?? state.status,
        },
      },
      { new: true }
    );

    if (!updatedState)
      throw new InvalidInputException("Failed to update state");
    return updatedState;
  }

  public async updateStatus(_id: string, data: IState) {
    let state = await State.findOne({ _id });

    if (!state) {
      throw new NotFoundException();
    }

    let updateStatus = await State.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || state.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("State not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const state = await State.findByIdAndDelete({ _id });
    if (!state) throw new InvalidInputException("State not found");
  }
}
