import dotenv from "dotenv";
import { PayrollReport } from "../models/payroll-report/payroll-report.model";

dotenv.config();

export const runPayrollReportSeeder = async () => {
  const payrollReportData = [
    {
      startTime: new Date("2025-03-19T09:00:00Z"),
      endTime: new Date("2025-03-19T17:00:00Z"),
      payrollReportId: "PR20250319-01",
      commissionReportIds: [],
      salary: 5000,
      totalGrossSales: 20000,
      totalEarnings: 7000,
      totalCommission: 1500,
      bonus: 500,
      spiffBonus: 200,
      reimbursementAmount: 100,
      status: "STAFF DRAFT",
      paymentStatus: "PENDING",
      paidOn: null,
      reportPath: "/path/to/report",
      createdBy: "admin",
    },
    {
      startTime: new Date("2025-03-20T09:00:00Z"),
      endTime: new Date("2025-03-20T17:00:00Z"),
      payrollReportId: "PR20250320-01",
      commissionReportIds: [],
      salary: 5500,
      totalGrossSales: 21000,
      totalEarnings: 7500,
      totalCommission: 1600,
      bonus: 600,
      spiffBonus: 250,
      reimbursementAmount: 120,
      status: "STAFF DRAFT",
      paymentStatus: "PENDING",
      paidOn: null,
      reportPath: "/path/to/report",
      createdBy: "admin",
    },
  ];

  try {
    await PayrollReport.insertMany(payrollReportData);
    console.log("Payroll Report seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting Payroll Report seed data:", error);
  }
};
