import React, { useState, createContext } from "react";
import {
  ARCGIS_MAP_TYPES,
  DATA_POINT_FILTER_TYPES,
} from "../constants/mapConstants";

export const MapContext = createContext();

export function MapContextProvider(props) {
  const [mapType, setMapType] = useState(ARCGIS_MAP_TYPES.TOPO);

  const [dataFilterType, setDataFilterType] = useState(
    DATA_POINT_FILTER_TYPES.DATE
  );

  const [selectedData, setSelectedData] = useState({
    comment: "",
    edited: "Y",
    session: "9",
    change_time: "5/10/2020 2:50:58 PM",
    create_time: "5/10/2020 1:44:57 PM",
    road_related_issues: "null",
    image:
      "https://s3.ca-central-1.amazonaws.com/iport-images/media/TestCity/2020/5/10/471ffa08c0acbdb2/2020510_94457_yolo_out_py.png",
    longitude: "-79.8958475",
    heading: "215.9947815",
    pci: "Good",
    auditor: "null",
    latitude: "43.2906462",
    detail_from_city: "null",
    exported: "N",
    app_version: "1",
    id: "26364",
    device_sn: "471ffa08c0acbdb2",
    damage_type: "null",
    city: "TestCity",
    address: "ON-403, Hamilton, ON L0R, Canada",
    flag: "N",
    date: "Collected on 2020-05-10",
    current_city: "Hamilton",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedLayers, setSelectedLayers] = useState([]);

  const [zoomToSelectedData, setZoomToSelectedData] = useState(false);

  const contextValues = {
    mapType,
    dataFilterType,
    selectedData,
    selectedDate,
    selectedLayers,
    zoomToSelectedData,
  };

  const contextFunctions = {
    setMapType,
    setDataFilterType,
    setSelectedData,
    setSelectedDate,
    setSelectedLayers,
    setZoomToSelectedData,
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
