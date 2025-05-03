import { Staff } from "../../models/staff/staff.model";
import { IStaff } from "../../models/staff/staff.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class StaffService {
  private static _instance: StaffService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IStaff) {
    if (
      !data.parentLoginId ||
      !data.userId ||
      !data.firstName ||
      !data.lastName ||
      !data.mobileNumber ||
      !data.userName ||
      !data.emailId ||
      !data.role ||
      !data.dateOfJoining ||
      !data.password ||
      !data.confirmPassword ||
      !data.group
    ) {
      throw new InvalidInputException("Missing required fields");
    }

    let existingStaff = await Staff.findOne({ emailId: data.emailId });
    if (existingStaff) {
      throw new InvalidInputException("Staff with this email already exists");
    }

    let staff = new Staff({
      parentLoginId: data.parentLoginId,
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber,
      userName: data.userName,
      emailId: data.emailId,
      manager: data.manager,
      managerLoginId: data.managerLoginId,
      managerId: data.managerId,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      role: data.role,
      dateOfJoining: data.dateOfJoining,
      password: data.password,
      confirmPassword: data.confirmPassword,
      group: data.group,
      vanlynkAccess: data.vanlynkAccess,
      showOnDispatchboard: data.showOnDispatchboard,
      estimatesReqMgApproval: data.estimatesReqMgApproval,
      invoicesReqMgApproval: data.invoicesReqMgApproval,
      ssNumber: data.ssNumber,
      driverLicenseNumber: data.driverLicenseNumber,
      dob: data.dob,
      streetAddress: data.streetAddress,
      homePhone: data.homePhone,
      w2Elgible: data.w2Elgible,
      i9Verified: data.i9Verified,
      emergencyName: data.emergencyName,
      emergencyRelationShip: data.emergencyRelationShip,
      emergencyPhone1: data.emergencyPhone1,
      emergencyPhone2: data.emergencyPhone2,
      weeklySalary: data.weeklySalary,
      weeklySalaryValue: data.weeklySalaryValue,
      overTimeAfter8Hrs: data.overTimeAfter8Hrs,
      hourlyRateValue: data.hourlyRateValue,
      hourlyRate: data.hourlyRate,
      doubleTimeOver12Hrs: data.doubleTimeOver12Hrs,
      commisionRate: data.commisionRate,
      commisionRange: data.commisionRange,
      payrollFrequency: data.payrollFrequency,
      paymentMethod: data.paymentMethod,
      billRate: data.billRate,
      bankName: data.bankName,
      swiftNumber: data.swiftNumber,
      ibanNumber: data.ibanNumber,
      routingNumber: data.routingNumber,
      accountNumber: data.accountNumber,
      skillLevel: data.skillLevel,
      skills: data.skills,
      bio: data.bio,
      comments: data.comments,
      rating: data.rating,
      shirtSize: data.shirtSize,
      bootSize: data.bootSize,
      pantWaistSize: data.pantWaistSize,
      pantLengthSize: data.pantLengthSize,
      firstMessageHour: data.firstMessageHour,
      firstMessage: data.firstMessage,
      paidBreaks: data.paidBreaks,
      deductHrForLunch: data.deductHrForLunch,
      deductForEachBreak: data.deductForEachBreak,
      lunchHourForEachBreak: data.lunchHourForEachBreak,
      lunchHourForLunch: data.lunchHourForLunch,
      lunchHour: data.lunchHour,
      sendClockinout: data.sendClockinout,
      sendRemindersIn: data.sendRemindersIn,
      sendReminders: data.sendReminders,
      sendRemindersOut: data.sendRemindersOut,
      bioImage: data.bioImage,
      secondMessageHour: data.secondMessageHour,
      secondMessage: data.secondMessage,
      thirdMessageHour: data.thirdMessageHour,
      thirdMessage: data.thirdMessage,
      fourthMessage: data.fourthMessage,
      autoCheckouts: data.autoCheckouts,
      timeCardRequiresForManagerApproval:
        data.timeCardRequiresForManagerApproval,
      autoClockOutAfterXMins: data.autoClockOutAfterXMins,
      staffTimings: data.staffTimings,
      sick: data.sick,
      vacation: data.vacation,
      fileUpload: data.fileUpload,
      writeupsUpload: data.writeupsUpload,
      createdBy: data.createdBy,
      createdOn: data.createdOn,
      modifiedBy: data.modifiedBy,
      modifiedOn: data.modifiedOn,
      staffPopUp: data.staffPopUp,
      licenseStatus: data.licenseStatus,
      deviceToken: data.deviceToken,
      clockStatus: data.clockStatus,
      isOT: data.isOT,
      isAfterHours: data.isAfterHours,
      motionStatus: data.motionStatus,
      lastDispatchedWO: data.lastDispatchedWO,
      todaysTime: data.todaysTime,
      remainingTime: data.remainingTime,
      lastKnowLocation: data.lastKnowLocation,
    });

    try {
      return await staff.save();
    } catch (error: any) {
      throw new Error("Error saving staff: " + error.message);
    }
  }

  public async getStaffById(_id: string) {
    const staff = await Staff.findById({ _id });
    if (!staff) throw new InvalidInputException("Staff not found");
    return staff;
  }

  public async getStaffs() {
    const staffs = await Staff.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (staffs.length === 0)
      throw new InvalidInputException("Staffs not found");
    return staffs;
  }

  public async update(_id: string, data: IStaff) {
    const staff = await Staff.findById(_id);
    if (!staff) {
      throw new NotFoundException("Staff not found");
    }

    if (data.emailId && data.emailId !== staff.emailId) {
      let existingStaff = await Staff.findOne({ emailId: data.emailId });
      if (existingStaff) {
        throw new InvalidInputException("Staff with this email already exists");
      }
    }

    let updatedStaff = await Staff.findByIdAndUpdate(
      _id,
      {
        $set: {
          parentLoginId: data.parentLoginId ?? staff.parentLoginId,
          userId: data.userId ?? staff.userId,
          firstName: data.firstName ?? staff.firstName,
          lastName: data.lastName ?? staff.lastName,
          mobileNumber: data.mobileNumber ?? staff.mobileNumber,
          userName: data.userName ?? staff.userName,
          emailId: data.emailId ?? staff.emailId,
          manager: data.manager ?? staff.manager,
          managerLoginId: data.managerLoginId ?? staff.managerLoginId,
          managerId: data.managerId ?? staff.managerId,
          city: data.city ?? staff.city,
          state: data.state ?? staff.state,
          zipCode: data.zipCode ?? staff.zipCode,
          role: data.role ?? staff.role,
          dateOfJoining: data.dateOfJoining ?? staff.dateOfJoining,
          password: data.password ?? staff.password,
          confirmPassword: data.confirmPassword ?? staff.confirmPassword,
          group: data.group ?? staff.group,
          vanlynkAccess: data.vanlynkAccess ?? staff.vanlynkAccess,
          showOnDispatchboard:
            data.showOnDispatchboard ?? staff.showOnDispatchboard,
          estimatesReqMgApproval:
            data.estimatesReqMgApproval ?? staff.estimatesReqMgApproval,
          invoicesReqMgApproval:
            data.invoicesReqMgApproval ?? staff.invoicesReqMgApproval,
          ssNumber: data.ssNumber ?? staff.ssNumber,
          driverLicenseNumber:
            data.driverLicenseNumber ?? staff.driverLicenseNumber,
          dob: data.dob ?? staff.dob,
          streetAddress: data.streetAddress ?? staff.streetAddress,
          homePhone: data.homePhone ?? staff.homePhone,
          w2Elgible: data.w2Elgible ?? staff.w2Elgible,
          i9Verified: data.i9Verified ?? staff.i9Verified,
          emergencyName: data.emergencyName ?? staff.emergencyName,
          emergencyRelationShip:
            data.emergencyRelationShip ?? staff.emergencyRelationShip,
          emergencyPhone1: data.emergencyPhone1 ?? staff.emergencyPhone1,
          emergencyPhone2: data.emergencyPhone2 ?? staff.emergencyPhone2,
          weeklySalary: data.weeklySalary ?? staff.weeklySalary,
          weeklySalaryValue: data.weeklySalaryValue ?? staff.weeklySalaryValue,
          overTimeAfter8Hrs: data.overTimeAfter8Hrs ?? staff.overTimeAfter8Hrs,
          hourlyRateValue: data.hourlyRateValue ?? staff.hourlyRateValue,
          hourlyRate: data.hourlyRate ?? staff.hourlyRate,
          doubleTimeOver12Hrs:
            data.doubleTimeOver12Hrs ?? staff.doubleTimeOver12Hrs,
          commisionRate: data.commisionRate ?? staff.commisionRate,
          commisionRange: data.commisionRange ?? staff.commisionRange,
          payrollFrequency: data.payrollFrequency ?? staff.payrollFrequency,
          paymentMethod: data.paymentMethod ?? staff.paymentMethod,
          billRate: data.billRate ?? staff.billRate,
          bankName: data.bankName ?? staff.bankName,
          swiftNumber: data.swiftNumber ?? staff.swiftNumber,
          ibanNumber: data.ibanNumber ?? staff.ibanNumber,
          routingNumber: data.routingNumber ?? staff.routingNumber,
          accountNumber: data.accountNumber ?? staff.accountNumber,
          skillLevel: data.skillLevel ?? staff.skillLevel,
          skills: data.skills ?? staff.skills,
          bio: data.bio ?? staff.bio,
          comments: data.comments ?? staff.comments,
          rating: data.rating ?? staff.rating,
          shirtSize: data.shirtSize ?? staff.shirtSize,
          bootSize: data.bootSize ?? staff.bootSize,
          pantWaistSize: data.pantWaistSize ?? staff.pantWaistSize,
          pantLengthSize: data.pantLengthSize ?? staff.pantLengthSize,
          firstMessageHour: data.firstMessageHour ?? staff.firstMessageHour,
          firstMessage: data.firstMessage ?? staff.firstMessage,
          paidBreaks: data.paidBreaks ?? staff.paidBreaks,
          deductHrForLunch: data.deductHrForLunch ?? staff.deductHrForLunch,
          deductForEachBreak:
            data.deductForEachBreak ?? staff.deductForEachBreak,
          lunchHourForEachBreak:
            data.lunchHourForEachBreak ?? staff.lunchHourForEachBreak,
          lunchHourForLunch: data.lunchHourForLunch ?? staff.lunchHourForLunch,
          lunchHour: data.lunchHour ?? staff.lunchHour,
          sendClockinout: data.sendClockinout ?? staff.sendClockinout,
          sendRemindersIn: data.sendRemindersIn ?? staff.sendRemindersIn,
          sendReminders: data.sendReminders ?? staff.sendReminders,
          sendRemindersOut: data.sendRemindersOut ?? staff.sendRemindersOut,
          bioImage: data.bioImage ?? staff.bioImage,
          secondMessageHour: data.secondMessageHour ?? staff.secondMessageHour,
          secondMessage: data.secondMessage ?? staff.secondMessage,
          thirdMessageHour: data.thirdMessageHour ?? staff.thirdMessageHour,
          thirdMessage: data.thirdMessage ?? staff.thirdMessage,
          fourthMessage: data.fourthMessage ?? staff.fourthMessage,
          autoCheckouts: data.autoCheckouts ?? staff.autoCheckouts,
          timeCardRequiresForManagerApproval:
            data.timeCardRequiresForManagerApproval ??
            staff.timeCardRequiresForManagerApproval,
          autoClockOutAfterXMins:
            data.autoClockOutAfterXMins ?? staff.autoClockOutAfterXMins,
          staffTimings: data.staffTimings ?? staff.staffTimings,
          sick: data.sick ?? staff.sick,
          vacation: data.vacation ?? staff.vacation,
          fileUpload: data.fileUpload ?? staff.fileUpload,
          writeupsUpload: data.writeupsUpload ?? staff.writeupsUpload,
          createdBy: data.createdBy ?? staff.createdBy,
          createdOn: data.createdOn ?? staff.createdOn,
          modifiedBy: data.modifiedBy ?? staff.modifiedBy,
          modifiedOn: data.modifiedOn ?? staff.modifiedOn,
          staffPopUp: data.staffPopUp ?? staff.staffPopUp,
          licenseStatus: data.licenseStatus ?? staff.licenseStatus,
          deviceToken: data.deviceToken ?? staff.deviceToken,
          clockStatus: data.clockStatus ?? staff.clockStatus,
          isOT: data.isOT ?? staff.isOT,
          isAfterHours: data.isAfterHours ?? staff.isAfterHours,
          motionStatus: data.motionStatus ?? staff.motionStatus,
          lastDispatchedWO: data.lastDispatchedWO ?? staff.lastDispatchedWO,
          todaysTime: data.todaysTime ?? staff.todaysTime,
          remainingTime: data.remainingTime ?? staff.remainingTime,
          lastKnowLocation: data.lastKnowLocation ?? staff.lastKnowLocation,
        },
      },
      { new: true }
    );

    if (!updatedStaff) {
      throw new InvalidInputException("Failed to update staff");
    }
    return updatedStaff;
  }

  public async updateStatus(_id: string, data: IStaff) {
    let staff = await Staff.findOne({ _id });

    if (!staff) {
      throw new NotFoundException();
    }

    let updateStatus = await Staff.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || staff.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Staff not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const staff = await Staff.findByIdAndDelete({ _id });
    if (!staff) throw new InvalidInputException("Staff not found");
  }
}
