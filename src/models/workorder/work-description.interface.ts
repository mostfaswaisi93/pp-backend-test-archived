// interfaces/IWorkDescription.ts
export interface IWorkDescription {
  jobTitle?: string;
  estimatedHours?: string;
  workDescription?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  selectCategory?: string;
  selectsubCategory?: string;
  makeReoccuring?: string;
  makeReccour?: boolean;
  allDay?: boolean;
  Document?: any[];
  images?: any[];
  filename?: string;
  createdOn?: string;
  alpDateRange?: string[];
  startDateUTC?: string;
  endDateUTC?: string;
  createddateUTC?: string;
}
