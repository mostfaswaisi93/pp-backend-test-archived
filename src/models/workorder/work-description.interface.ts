export interface IWorkDescription {
  jobTitle?: string;
  estimatedHours?: string;
  workDescription?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  category?: string;  // Renamed for clarity
  subCategory?: string;  // Renamed for clarity
  makeRecurring?: string;  // Corrected spelling
  makeRecur?: boolean;  // Corrected spelling
  allDay?: boolean;
  documents?: any[];  // Renamed for clarity
  images?: any[];
  filename?: string;
  createdDate?: string;  // Renamed for consistency
  dateRange?: string[];  // Renamed for clarity
  startDateUTC?: string;
  endDateUTC?: string;
  createdDateUTC?: string;  // Renamed for consistency
}
