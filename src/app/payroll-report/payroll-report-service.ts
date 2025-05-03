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
    let existingPayrollReport = await PayrollReport.findOne({
      payrollReportId: data.payrollReportId,
    });
    if (existingPayrollReport) {
      throw new InvalidInputException(
        "PayrollReport already exists for this ID"
      );
    }

    let payrollReport = new PayrollReport({
      startTime: data.startTime,
      endTime: data.endTime,
      payrollReportId: data.payrollReportId,
      commissionReportIds: data.commissionReportIds,
      salary: data.salary,
      totalGrossSales: data.totalGrossSales,
      totalEarnings: data.totalEarnings,
      totalCommission: data.totalCommission,
      bonus: data.bonus,
      spiffBonus: data.spiffBonus,
      reimbursementAmount: data.reimbursementAmount,
      status: data.status ?? "STAFF DRAFT",
      paymentStatus: data.paymentStatus ?? "PENDING",
      paidOn: data.paidOn,
      reportPath: data.reportPath,
      createdBy: data.createdBy,
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

  public async update(_id: string, data: Partial<IPayrollReport>) {
    const payrollReport = await PayrollReport.findById(_id);
    if (!payrollReport) {
      throw new NotFoundException("Payroll report not found");
    }

    let updatedPayrollReport = await PayrollReport.findByIdAndUpdate(
      _id,
      {
        $set: {
          startTime: data.startTime ?? payrollReport.startTime,
          endTime: data.endTime ?? payrollReport.endTime,
          payrollReportId:
            data.payrollReportId ?? payrollReport.payrollReportId,
          commissionReportIds:
            data.commissionReportIds ?? payrollReport.commissionReportIds,
          salary: data.salary ?? payrollReport.salary,
          totalGrossSales:
            data.totalGrossSales ?? payrollReport.totalGrossSales,
          totalEarnings: data.totalEarnings ?? payrollReport.totalEarnings,
          totalCommission:
            data.totalCommission ?? payrollReport.totalCommission,
          bonus: data.bonus ?? payrollReport.bonus,
          spiffBonus: data.spiffBonus ?? payrollReport.spiffBonus,
          reimbursementAmount:
            data.reimbursementAmount ?? payrollReport.reimbursementAmount,
          status: data.status ?? payrollReport.status,
          paymentStatus: data.paymentStatus ?? payrollReport.paymentStatus,
          paidOn: data.paidOn ?? payrollReport.paidOn,
          reportPath: data.reportPath ?? payrollReport.reportPath,
          createdBy: data.createdBy ?? payrollReport.createdBy,
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
