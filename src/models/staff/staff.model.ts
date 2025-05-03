import mongoose, { model, Schema } from "mongoose";
import { IStaff } from "./staff.interface";

// Define the schema for the staff collection
const staffSchema = new Schema<IStaff>({
  staffId: { type: String },
  qrImage: { type: String },
  timeZone: { type: String },
  proId: { type: String },
  proEmailId: { type: String },
  parentLoginId: { type: String, required: true }, // Parent Login ID is required
  userId: { type: String, required: true }, // User ID is required
  firstName: { type: String, required: true }, // First name is required
  lastName: { type: String, required: true }, // Last name is required
  mobileNumber: { type: String, required: true }, // Mobile number is required
  userName: { type: String, required: true }, // Username is required
  emailId: { type: String, required: true }, // Email is required
  manager: { type: String }, // Manager name
  managerLoginId: { type: mongoose.Schema.Types.ObjectId }, // Manager login ID (ObjectId reference)
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "staff" }, // Reference to another staff document for manager
  city: { type: String },
  state: { type: String },
  zipCode: { type: String }, // Unified naming for zipCode
  role: { type: String, required: true }, // Role is required
  dateOfJoining: { type: String, required: true }, // Date of joining is required
  password: { type: String, required: true }, // Password is required
  confirmPassword: { type: String, required: true }, // It is recommended not to store confirmPassword in DB
  group: { type: String, required: true }, // Group is required
  vanlynkAccess: { type: Boolean }, // Boolean value indicating vanlynk access
  showOnDispatchboard: { type: Boolean }, // Boolean for whether to show on dispatchboard
  estimatesReqMgApproval: { type: Boolean }, // Boolean for manager approval for estimates
  invoicesReqMgApproval: { type: Boolean }, // Boolean for manager approval for invoices
  ssNumber: { type: String }, // Social security number
  driverLicenseNumber: { type: String }, // Driver's license number
  dob: { type: Date }, // Date of birth (modified to Date type)
  streetAddress: { type: String },
  homePhone: { type: String },
  w2Elgible: { type: Boolean },
  i9Verified: { type: Boolean },
  emergencyName: { type: String },
  emergencyRelationShip: { type: String },
  emergencyPhone1: { type: String },
  emergencyPhone2: { type: String },
  weeklySalary: { type: String },
  weeklySalaryValue: { type: String },
  overTimeAfter8Hrs: { type: Boolean }, // Boolean indicating overtime after 8 hours
  hourlyRateValue: { type: String },
  hourlyRate: { type: String },
  doubleTimeOver12Hrs: { type: Boolean }, // Double time after 12 hours of work
  commisionRate: { type: Number }, // Commission rate (changed to Number type)
  commisionRange: [
    // Commission range with rate, min and max range
    {
      rate: { type: Number },
      minRange: { type: Number },
      maxRange: { type: Number },
    },
  ],
  payrollFrequency: {
    // Reference to account settings for payroll frequency
    type: mongoose.Schema.Types.ObjectId,
    ref: "accountsettings",
  },
  paymentMethod: { type: String },
  billRate: { type: String },
  bankName: { type: String },
  swiftNumber: { type: String },
  ibanNumber: { type: String },
  routingNumber: { type: String },
  accountNumber: { type: String },
  skillLevel: { type: String },
  skills: [{ type: String }], // Array of skills (changed to an array of strings)
  bio: { type: String },
  comments: { type: String },
  rating: { type: String },
  shirtSize: { type: String },
  bootSize: { type: String },
  pantWaistSize: { type: String },
  pantLengthSize: { type: String },
  firstMessageHour: { type: String },
  firstMessage: { type: String },
  paidBreaks: { type: Boolean, default: true }, // Default value for paid breaks
  deductHrForLunch: { type: Boolean, default: false },
  deductForEachBreak: { type: Boolean, default: false },
  lunchHourForEachBreak: { type: Number, default: 0 },
  lunchHourForLunch: { type: Number, default: 0 },
  lunchHour: { type: String },
  sendClockinout: { type: Boolean },
  sendRemindersIn: { type: Boolean },
  sendReminders: { type: Boolean },
  sendRemindersOut: { type: Boolean },
  bioImage: { type: String },
  secondMessageHour: { type: String },
  secondMessage: { type: String },
  thirdMessageHour: { type: String },
  thirdMessage: { type: String },
  fourthMessage: { type: String },
  autoCheckouts: { type: Boolean },
  timeCardRequiresForManagerApproval: { type: Boolean, default: false }, // Default value for manager approval requirement
  autoClockOutAfterXMins: { type: Number },
  staffTimings: [
    // Array for staff timings and work hours
    {
      id: String,
      day: String,
      clockin: String,
      clockout: String,
      dayOff: { type: Boolean, default: false },
      onCall: { type: Boolean, default: false },
      totalMins: { type: Number },
      breakMins: { type: Number },
      lunchMins: { type: Number },
      clockinHour: { type: Number },
      clockoutHour: { type: Number },
      clockoutHourX: { type: Number },
    },
  ],
  sick: {
    // Sick leave configuration
    yearsBeginOn: { type: String },
    yearBeginDay: { type: Number },
    hoursAvailbleForThisYear: { type: Number },
    hoursUsedInThisYear: { type: Number },
    resetHoursEachNewYear: { type: Boolean },
  },
  vacation: {
    // Vacation leave configuration
    yearsBeginOn: { type: String },
    yearBeginDay: { type: Number },
    hoursAvailbleForThisYear: { type: Number },
    hoursUsedInThisYear: { type: Number },
    resetHoursEachNewYear: { type: Boolean },
  },
  fileUpload: [
    // File upload details
    {
      description: { type: String },
      documentName: [{ type: String }],
      documentURL: { type: String },
      uploadedOn: { type: Date }, // Modified to Date type
      createdby: { type: String },
    },
  ],
  writeupsUpload: [
    // Write-ups upload details
    {
      writeupsdescription: { type: String },
      writeupsdocumentName: [{ type: String }],
      writeupsdocumentURL: { type: String },
      writeupsuploadedOn: { type: Date }, // Modified to Date type
      writeupscreatedby: { type: String },
    },
  ],
  createdBy: { type: String },
  createdOn: { type: Date }, // Modified to Date type
  modifiedBy: { type: String },
  modifiedOn: { type: Date }, // Modified to Date type
  staffPopUp: {
    // Popup settings for staff info
    rehiredFlag: { type: String, default: "NO" },
    employementStatus: { type: String, default: "ACTIVE", required: true }, // Employment status is required
    document: [{ type: Object }],
    employeeDate: { type: Date }, // Modified to Date type
    employeeReason: { type: String },
  },
  licenseStatus: { type: String },
  deviceToken: { type: String },
  clockStatus: { type: Number, default: 0 },
  isOT: { type: Boolean, default: false }, // Boolean indicating if it's overtime
  isAfterHours: { type: Boolean, default: false }, // Boolean for after hours status
  motionStatus: { type: String, default: "" },
  lastDispatchedWO: { type: String, default: "" },
  todaysTime: { type: Number, default: 0 },
  remainingTime: { type: Number, default: 0 },
  lastKnowLocation: {
    // Last known location
    lat: { type: String },
    lng: { type: String },
    date: { type: Date },
  },
});

// Export the Staff model based on the schema
export const Staff = model<IStaff>("Staff", staffSchema);
