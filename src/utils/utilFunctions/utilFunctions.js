import { DATA_POINT_FILTER_TYPE } from "../../constants/mapConstants";

export function isValidObj(obj) {
  return obj !== null && obj !== undefined;
}
export function isDateValid(date) {
  return date instanceof Date && !isNaN(date);
}

function getMonthShortName(date) {
  let shortName = "unknown mont short name";
  if (isDateValid(date)) {
    const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
      .format;
    shortName = shortMonthName(date);
  }
  return shortName;
}

export function getDateValue(dateString, valueType) {
  const currentDate = new Date(dateString);
  if (isDateValid(currentDate)) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    const monthString = getMonthShortName(currentDate);
    switch (valueType) {
      case DATA_POINT_FILTER_TYPE.YEAR:
        return year;
      case DATA_POINT_FILTER_TYPE.MONTH:
        return `${monthString}, ${year}`;
      default:
        return `${monthString} ${date}, ${year}`;
    }
  }
}
