export interface IStaffStats {
  didNotClockIn: number;
  clockIn: number;
  sick: number;
  off: number;
  onBreak: number;
  clockOut: number;
}

export interface IEstimates {
  total: number;
  draft: number;
  rejected: number;
  approveds: number;
  modify: number;
}

export interface IJobs {
  ongoing: number;
  complete: number;
  recall: number;
  pending: number;
  paused: number;
}

export interface IStaff {
  loginId: string;
  group: string;
  staffStats: IStaffStats;
  estimates: IEstimates;
  jobs: IJobs;
  totalSales: number;
  avgTicketSize: number;
}
