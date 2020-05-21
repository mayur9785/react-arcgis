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
import { MapWithLineRepresentRoads } from "./components/mapComonent/mapWithLineRepresentRoads";

function App() {
  return (
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
      <MapWithLineRepresentRoads />
      {/* </header> */}
    </div>
  );
}

export default App;
