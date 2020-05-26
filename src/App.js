import React from "react";
import "./App.css";
import { MyMap } from "./components/mapComonent/ArcgisMap";
import { StarterMap } from "./components/mapComonent/starterMap";
import { MapWithLayer } from "./components/mapComonent/mapWithLayer";
import { MapWithLayerStyled } from "./components/mapComonent/mapWithLayerStyled";
import { MapWithPopup } from "./components/mapComonent/mapWithPopup";
import { MapServerSideQueryFeatureLayer } from "./components/mapComonent/mapServerSideQueryFeatureLayer";
import { MapClientSideQueryFeatureLayer } from "./components/mapComonent/mapClientSideQueryFeatureLayer";
import { MapFilterFeatureData } from "./components/mapComonent/mapFilterFeatureData";
import { MapAddLayFromItem } from "./components/mapComonent/mapAddLayerFromItem";
import { MapFeatureLayerWithLocalData } from "./components/mapComonent/mapFeatureLayerWithLocalData";
import { MapWithLineAndPolygon } from "./components/mapComonent/mapWithLineAndPolygon";
import { MapWithFeatureTable } from "./components/mapComonent/mapWithFeatureTable";
import { StarterWebMap } from "./components/mapComonent/starterWebMap";
import { MapWithMoskokaBoundaryAndPoints } from "./components/mapComonent/mapWithMoskokaBoundaryAndPoints";

import { MapWithFeatureLayer } from "./components/mapComonent/roadWithFeatureLayer/fromFeatureLayer";
import { MapWithLineRepresentRoads } from "./components/mapComonent/roadWithFeatureLayer/fromGraphicLayer";
import { MapWithLayers } from "./components/mapComonent/roadWithFeatureLayer/fromLayers";

import roadData from "./components/mapComonent/hamiltonDataFilterDemo/data.json";
import IrisArcgisHome from "./containers/home/home";
import { MapContextProvider } from "./context/mapContext";

const DATE_FILTER_TYPE = {
  YEAR: "year",
  MONTH: "month",
  WEEK: "week",
  DATE: "date",
};

const isDateValid = (date) => {
  return date instanceof Date && !isNaN(date);
};

const getMonthShortName = (date) => {
  let shortName = "unknown mont short name";
  if (isDateValid(date)) {
    const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
      .format;
    shortName = shortMonthName(date);
  }
  return shortName;
};

const getDateValue = (dateString, valueType) => {
  const currentDate = new Date(dateString);
  if (isDateValid(currentDate)) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    const monthString = getMonthShortName(currentDate);
    switch (valueType) {
      case DATE_FILTER_TYPE.YEAR:
        return year;
      case DATE_FILTER_TYPE.MONTH:
        return `${monthString}, ${year}`;
      default:
        return `${monthString} ${date}, ${year}`;
    }
  }
};
const reduceDataByDate = (data, category, dateType = DATE_FILTER_TYPE.DATE) => {
  let rd = data.reduce((categoriedData, element) => {
    const fieldValue = element[category];
    const newKey = getDateValue(fieldValue, dateType);
    const recentData = categoriedData[newKey] || [];
    recentData.push(element);
    return { ...categoriedData, [newKey]: recentData };
  }, {});
  return rd;
};
function App() {
  console.log("inApp", roadData);
  const reducedByDate = reduceDataByDate(roadData, "change_time");
  console.log(reducedByDate);
  return (
    <MapContextProvider>
      <div className="App">
        {/* <header className="App-header"> */}
        {/* <MyMap /> */}
        {/* <StarterMap /> */}
        {/* <MapWithLayer /> */}
        {/* <MapWithLayerStyled /> */}
        {/* <MapWithPopup /> */}
        {/* <MapServerSideQueryFeatureLayer /> */}
        {/* <MapClientSideQueryFeatureLayer /> */}
        {/* <MapFilterFeatureData /> */}
        {/* <MapAddLayFromItem /> */}
        {/* <MapFeatureLayerWithLocalData /> */}
        {/* <MapWithLineAndPolygon /> */}
        {/* <MapWithFeatureTable /> */}
        {/* <StarterWebMap /> */}
        {/* <MapWithMoskokaBoundaryAndPoints /> */}
        {/* <MapWithLineRepresentRoads /> */}
        {/* <MapWithFeatureLayer /> */}
        {/* <MapWithLayers /> */}
        {/* </header> */}
        <IrisArcgisHome />
      </div>
    </MapContextProvider>
  );
}

export default App;
