import { PayrollReport } from "../../models/payroll-report/payroll-report.model";
import { IPayrollReport } from "../../models/payroll-report/payroll-report.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class PayrollReportService {
  private static _instance: PayrollReportService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: IPayrollReport) {
    // if (!data.day || !data.fromTime || !data.toTime) {
    //   throw new InvalidInputException("Missing required fields");
    // }

    let existingPayrollReport = await PayrollReport.findOne({
      // day: data.day,
    });
    if (existingPayrollReport) {
      throw new InvalidInputException(
        "PayrollReport already exists for this day"
      );
    }

    let payrollReport = new PayrollReport({
      // day: data.day,
      // status: data.status ?? "OPEN",
    });

    try {
      return await payrollReport.save();
    } catch (error: any) {
      throw new Error("Error saving payroll report: " + error.message);
    }
  }

  public async getPayrollReportById(_id: string) {
    const payrollReport = await PayrollReport.findById({ _id });
    if (!payrollReport)
      throw new InvalidInputException("Payroll report not found");
    return payrollReport;
  }

  public async getPayrollReports() {
    const payrollReports = await PayrollReport.find({
      status: "ACTIVE",
    }).sort({
      state: 1,
    });
    if (payrollReports.length === 0)
      throw new InvalidInputException("Payroll reports not found");
    return payrollReports;
  }

  public async update(_id: string, data: IPayrollReport) {
    const payrollReport = await PayrollReport.findById(_id);
    if (!payrollReport) {
      throw new NotFoundException("Payroll report not found");
    }

    // if (data.day) {
    //   let existingPayrollReport = await PayrollReport.findOne({
    //     day: data.day,
    //     _id: { $ne: _id },
    //   });
    //   if (existingPayrollReport) {
    //     throw new InvalidInputException(
    //       "PayrollReport already exists for this day"
    //     );
    //   }
    // }

    let updatedPayrollReport = await PayrollReport.findByIdAndUpdate(
      _id,
      {
        $set: {
          // day: data.day ?? payrollReport.day,
          // fromTime: data.fromTime ?? payrollReport.fromTime,
          // toTime: data.toTime ?? payrollReport.toTime,
          // status: data.status ?? payrollReport.status,
        },
      },
      { new: true }
    );

    if (!updatedPayrollReport) {
      throw new InvalidInputException("Failed to update payroll report");
    }
    return updatedPayrollReport;
  }

  public async updateStatus(_id: string, data: IPayrollReport) {
    let payrollReport = await PayrollReport.findOne({ _id });

    if (!payrollReport) {
      throw new NotFoundException();
    }

    let updateStatus = await PayrollReport.findByIdAndUpdate(
      _id,
      {
        $set: {
          // status: data.status || payrollReport.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus)
      throw new InvalidInputException("Payroll report not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const payrollReport = await PayrollReport.findByIdAndDelete({ _id });
    if (!payrollReport)
      throw new InvalidInputException("PayrollReport not found");
  }
}
