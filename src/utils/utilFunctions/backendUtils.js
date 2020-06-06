import { isValidObj } from "./utilFunctions";

export const getDataByDate = async (urlString, date) => {
  if (!isValidObj(urlString)) {
    urlString = process.env.REACT_APP_FETCH_DATA;
  }

  const url = new URL(urlString);
  // root url is given but not specify date, append "data" search params, otherwise
  // it would get all data from backend
  if (urlString === process.env.REACT_APP_FETCH_DATA && !isValidObj(date)) {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    url.searchParams.append("date", dateString);
  }
  // given url is not root url
  else {
    let dateString = null;
    if (
      isValidObj(date) &&
      new Date(date).toString().toLowerCase() !== "invalid data"
    ) {
      // date is given and could be converted to valid date
      dateString = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
    }

    if (dateString !== null) {
      url.searchParams.append("date", dateString);
    }
  }
  const token = process.env.REACT_APP_ACCESS_TOKEN;
  return new Promise((resolve, reject) => {
    fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          console.log("in [getDataPointsByURL], access error");
          reject(new Error("ACCESS DENIED"));
        } else {
          response.json().then((data) => {
            if (data.results !== null) {
              console.log("in [getDataPointsByURL], got data SUCCESSFULLY");
              resolve(data);
            } else {
              console.log("in [getDataPointsByURL], got data FAILED");
              reject(new Error("Faield to get data"));
            }
          });
        }
      })

      .catch((error) => {
        reject(error);
      });
  });
};
