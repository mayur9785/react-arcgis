import {
  DATA_POINT_GROUP_TYPES,
  LAYER_FILTER_TYPES,
} from "../../constants/mapConstants";

export function isValidObj(obj) {
  return obj !== null && obj !== undefined;
}
export function isDateValid(date) {
  return date instanceof Date && !isNaN(date);
}

// convert month number to string
// ie: 1 => Jan, 2 => Feb etc
function getMonthShortName(date) {
  let shortName = "unknown month short name";
  if (isDateValid(date)) {
    const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
      .format;
    shortName = shortMonthName(date);
  }
  return shortName;
}

// get date value base on date string and value type
// ie: valueType = Year, return 2020
//     valueType = Month, reutrn Jan 2020
//     valueType = date, return Jan 1, 2020
export function getDateValue(dateString, valueType) {
  const currentDate = new Date(dateString);
  if (isDateValid(currentDate)) {
    const year = currentDate.getFullYear();
    // const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    const monthString = getMonthShortName(currentDate);
    switch (valueType) {
      case DATA_POINT_GROUP_TYPES.YEAR:
        return year;
      case DATA_POINT_GROUP_TYPES.MONTH:
        return `${monthString}, ${year}`;
      default:
        return `${monthString} ${date}, ${year}`;
    }
  }
}

// found elements that exists in left array
// but not in right array
// if left = [1,2,3] and right = [2,3]
// it should return [1]
export function leftJoin(left, right) {
  const inLeftButNotRight = [];
  left.map((l) => {
    const matched = right.find((r) => r === l);
    if (matched === undefined) {
      inLeftButNotRight.push(l);
    }
  });
  return inLeftButNotRight;
}

export function isEmptyObject(object) {
  return (
    isValidObj(object) &&
    Object.keys(object).length === 0 &&
    object.constructor === Object
  );
}

/**
 * conver data points to be used for front end
 * ie: make all MMS and RRI from array to a single string value
 *     and convert all numbers that would be displayed on
 *     Arcgis map into strng values snce Arcgis libaray complains
 *     about that
 *
 * @param {Object} data // data point from our backend, used to display data on Arcgis map
 */
export function convertData(data) {
  // arcgis prefer strings instead of numbers
  // when it create attributes for data
  const idString = data.id.toString();
  const latString = data.latitude.toString();
  const longString = data.longitude.toString();

  const damageTypes = data[LAYER_FILTER_TYPES.MMS.keyName];
  const roadRelatedIssue = data[LAYER_FILTER_TYPES.RRI.keyName];
  let damageTypeString = "N / A";
  let roadRelatedIssueString = "N / A";
  if (damageTypes.length !== 0) {
    const dTypes = [];
    for (const type of damageTypes) {
      dTypes.push(type.name);
    }
    damageTypeString = dTypes.join(", ");
  }
  if (roadRelatedIssue.length !== 0) {
    const issueStrings = [];
    for (const issue of roadRelatedIssue) {
      issueStrings.push(issue.issue);
    }
    roadRelatedIssueString = issueStrings.join(", ");
  }
  return {
    ...data,
    id: idString,
    latitude: latString,
    longitude: longString,
    [LAYER_FILTER_TYPES.RRI.keyName]: roadRelatedIssueString,
    [LAYER_FILTER_TYPES.MMS.keyName]: damageTypeString,
  };
}

export function getReadableDate(date) {
  const monthString = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  return `${monthString} ${date.getDate()}, ${date.getFullYear()}`;
}
