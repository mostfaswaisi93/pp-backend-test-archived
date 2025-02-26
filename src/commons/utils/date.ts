import moment from "moment";

export function inRange(
  startDate: Date | moment.Moment,
  endDate: Date | moment.Moment,
  compareDate: Date | moment.Moment
) {
  let date = moment(compareDate).startOf("day");
  let start = moment(startDate).startOf("day");
  let end = moment(endDate).startOf("day");

  return date.isBetween(start, end) || date.isSame(start) || date.isSame(end);
}
export const addDays = function (date: Date | string, days: number) {
  let a = moment(date, "DD/MM/YYYY").startOf("day");
  a.add(days, "days");
  return a.toDate();
};
export const subDays = function (date: Date | string, days: number) {
  let a = moment(date, "DD/MM/YYYY").startOf("day");
  a.subtract(days, "days");

  return a.toDate();
};

export function isBeforeDateOnly(
  date: Date | moment.Moment | string,
  compareDate: Date | moment.Moment | string
) {
  let a = moment(date, "DD/MM/YYYY").startOf("day");
  let b = moment(compareDate, "DD/MM/YYYY").startOf("day");
  return a.isBefore(b);
}
export function isAfterDateOnly(
  date: Date | moment.Moment | string,
  compareDate: Date | moment.Moment | string
) {
  let a = moment(date, "DD/MM/YYYY").startOf("day");
  let b = moment(compareDate, "DD/MM/YYYY").startOf("day");
  return a.isAfter(b);
}
export function isAfterOrSameDateOnly(
  date: Date | moment.Moment | string,
  compareDate: Date | moment.Moment | string
) {
  let a = moment(date, "DD/MM/YYYY").startOf("day");
  let b = moment(compareDate, "DD/MM/YYYY").startOf("day");
  return a.isSameOrAfter(b);
}
export function isSameDateOnly(
  date: Date | moment.Moment | string,
  compareDate: Date | moment.Moment | string
) {
  let a = moment(date, "DD/MM/YYYY").startOf("day");
  let b = moment(compareDate, "DD/MM/YYYY").startOf("day");
  return a.isSame(b);
}
export function dateDifference(
  start: Date | moment.Moment | string,
  end: Date | moment.Moment | string
) {
  let a = moment(start, "DD/MM/YYYY").startOf("day");
  let b = moment(end, "DD/MM/YYYY").startOf("day");
  return a.diff(b, "days");
}

export const defaultFormat = function (
  date: Date | string,
  currentFormate: string,
  useCurrentFormat: boolean = false
) {
  return moment(date, currentFormate).format(
    useCurrentFormat ? currentFormate : "DD/MM/YYYY"
  );
};
export const timeSince = function (date: Date | string) {
  date = new Date(date);
  var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " month";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " m";
  }
  return Math.floor(seconds) + " s";
};

export const getDayByPosition = function (date: Date | string, days: number) {
  let a = moment(date, "DD/MM/YYYY").startOf("day");
  a.subtract(days, "days");
  return a.toDate();
};
