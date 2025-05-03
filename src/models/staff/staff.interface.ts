import mongoose, { Document } from "mongoose";

export interface IStaff extends Document {
  _id: string;
  staffId: string;
  qrImage: string;
  timeZone: string;
  proId: string;
  proEmailId: string;
  parentLoginId: string;
  userId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  userName: string;
  emailId: string;
  manager: string;
  managerLoginId: mongoose.Types.ObjectId;
  managerId: mongoose.Types.ObjectId;
  city: string;
  state: string;
  zipCode: string;
  role: string;
  dateOfJoining: string;
  password: string;
  confirmPassword: string;
  group: string;
  vanlynkAccess: boolean;
  showOnDispatchboard: boolean;
  estimatesReqMgApproval: boolean;
  invoicesReqMgApproval: boolean;
  ssNumber: string;
  driverLicenseNumber: string;
  dob: Date; // Changed to Date type
  streetAddress: string;
  homePhone: string;
  w2Elgible: boolean;
  i9Verified: boolean;
  emergencyName: string;
  emergencyRelationShip: string;
  emergencyPhone1: string;
  emergencyPhone2: string;
  weeklySalary: string;
  weeklySalaryValue: string;
  overTimeAfter8Hrs: boolean;
  hourlyRateValue: string;
  hourlyRate: string;
  doubleTimeOver12Hrs: boolean;
  commisionRate: number; // Changed to number type
  commisionRange: { rate: number; minRange: number; maxRange: number }[]; // Adjusted commisionRange to have an array of objects with specific fields
  payrollFrequency: mongoose.Types.ObjectId; // Reference to accountsettings collection
  paymentMethod: string;
  billRate: string;
  bankName: string;
  swiftNumber: string;
  ibanNumber: string;
  routingNumber: string;
  accountNumber: string;
  skillLevel: string;
  skills: string[]; // Changed to an array of strings
  bio: string;
  comments: string;
  rating: string;
  shirtSize: string;
  bootSize: string;
  pantWaistSize: string;
  pantLengthSize: string;
  firstMessageHour: string;
  firstMessage: string;
  paidBreaks: boolean;
  deductHrForLunch: boolean;
  deductForEachBreak: boolean;
  lunchHourForEachBreak: number;
  lunchHourForLunch: number;
  lunchHour: string;
  sendClockinout: boolean;
  sendRemindersIn: boolean;
  sendReminders: boolean;
  sendRemindersOut: boolean;
  bioImage: string;
  secondMessageHour: string;
  secondMessage: string;
  thirdMessageHour: string;
  thirdMessage: string;
  fourthMessage: string;
  autoCheckouts: boolean;
  timeCardRequiresForManagerApproval: boolean;
  autoClockOutAfterXMins: number;
  staffTimings: {
    id: string;
    day: string;
    clockin: string;
    clockout: string;
    dayOff: boolean;
    onCall: boolean;
    totalMins: number;
    breakMins: number;
    lunchMins: number;
    clockinHour: number;
    clockoutHour: number;
    clockoutHourX: number;
  }[];
  sick: {
    yearsBeginOn: string;
    yearBeginDay: number;
    hoursAvailbleForThisYear: number;
    hoursUsedInThisYear: number;
    resetHoursEachNewYear: boolean;
  };
  vacation: {
    yearsBeginOn: string;
    yearBeginDay: number;
    hoursAvailbleForThisYear: number;
    hoursUsedInThisYear: number;
    resetHoursEachNewYear: boolean;
  };
  fileUpload: {
    description: string;
    documentName: string[];
    documentURL: string;
    uploadedOn: Date; // Changed to Date type
    createdby: string;
  }[];
  writeupsUpload: {
    writeupsdescription: string;
    writeupsdocumentName: string[];
    writeupsdocumentURL: string;
    writeupsuploadedOn: Date; // Changed to Date type
    writeupscreatedby: string;
  }[];
  createdBy: string;
  createdOn: Date; // Changed to Date type
  modifiedBy: string;
  modifiedOn: Date; // Changed to Date type
  staffPopUp: {
    rehiredFlag: string;
    employementStatus: string;
    document: object[];
    employeeDate: Date; // Changed to Date type
    employeeReason: string;
  };
  licenseStatus: string;
  deviceToken: string;
  clockStatus: number;
  isOT: boolean;
  isAfterHours: boolean;
  motionStatus: string;
  lastDispatchedWO: string;
  todaysTime: number;
  remainingTime: number;
  lastKnowLocation: {
    lat: string;
    lng: string;
    date: Date;
  };
}
