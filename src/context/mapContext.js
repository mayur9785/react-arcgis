import React, { useState, createContext } from "react";
import {
  ARCGIS_MAP_TYPES,
  DATA_POINT_GROUP_TYPES,
  LAYER_FILTER_TYPES,
} from "../constants/mapConstants";
import { LAYER_TYPES } from "../containers/mapUtils/mapUtils";
import data from "../components/mapComonent/hamiltonDataFilterDemo/data.json";
export const MapContext = createContext();

export function MapContextProvider(props) {
  const [dataPoints, setDataPoints] = useState(data);
  const [mapType, setMapType] = useState(ARCGIS_MAP_TYPES.TOPO);

  const [dataGroupType, setDataGroupType] = useState(
    DATA_POINT_GROUP_TYPES.DATE
  );

  const [layerFilterTypes, setLayerFilterTypes] = useState(
    Object.keys(LAYER_FILTER_TYPES)
  );

  const [selectedData, setSelectedData] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedLayers, setSelectedLayers] = useState([
    LAYER_TYPES.DATA_POINT_LAYER,
  ]);

  const [zoomToSelectedData, setZoomToSelectedData] = useState(false);

  const [openPanel, setOpenPanel] = useState(false);

  const [selectedPanelIndex, setSelectedPanelIndex] = useState(0);

  const contextValues = {
    mapType,
    dataPoints,
    dataGroupType,
    layerFilterTypes,
    selectedData,
    selectedDate,
    selectedLayers,
    zoomToSelectedData,
    openPanel,
    selectedPanelIndex,
  };
  const contextFunctions = {
    setMapType,
    setDataPoints,
    setDataGroupType,
    setLayerFilterTypes,
    setSelectedData,
    setSelectedDate,
    setSelectedLayers,
    setZoomToSelectedData,
    setOpenPanel,
    setSelectedPanelIndex,
  };

  return (
    <MapContext.Provider
      value={{
        values: contextValues,
        setters: contextFunctions,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
}
