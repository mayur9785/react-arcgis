import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import muskokaShapeFileZip from "../../files/shapeFiles/Muskoka_Road_Network_Shapefile.zip";
import {
  getBoundaryAndCenter,
  getBaseMap,
  getMapView,
} from "../../containers/mapUtils/mapUtils";

const simpleLineSymbol = {
  type: "simple-line",
  color: [226, 119, 40], // orange
  width: 2,
};

const fieldInfomation = [
  {
    fieldName: "name",
    label: "Name",
    visible: true,
  },
  {
    fieldName: "Suffix",
    label: "Suffix",
    visible: true,
  },
  {
    fieldName: "direction",
    label: "direction",
    visible: true,
  },
  {
    fieldName: "L_LADD",
    label: "L_LADD",
    visible: true,
  },
  {
    fieldName: "L_HADD",
    label: "L_HADD",
    visible: true,
  },
  {
    fieldName: "R_LADD",
    label: "R_LADD",
    visible: true,
  },
  {
    fieldName: "R_HADD",
    label: "L_HADD",
    visible: true,
  },
  {
    fieldName: "L_MUNICIPA",
    label: "L_MUNICIPA",
    visible: true,
  },
  {
    fieldName: "R_MUNICIPA",
    label: "R_MUNICIPA",
    visible: true,
  },
  {
    fieldName: "ROAD_TYPE",
    label: "Road Type",
    visible: true,
  },
  {
    fieldName: "NID",
    label: "NID",
    visible: true,
  },
  {
    fieldName: "ROAD_NAME",
    label: "Road Name",
    visible: true,
  },
  {
    fieldName: "ROAD_ALLIAS",
    label: "Road Allias",
    visible: true,
  },
  {
    fieldName: "O_Range",
    label: "O Range",
    visible: true,
  },
  {
    fieldName: "Urban_Area",
    label: "Urban Area",
    visible: true,
  },
  {
    fieldName: "Oneway",
    label: "Oneway",
    visible: true,
  },
];

export const MapWithLineRepresentRoads = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      ["esri/Graphic", "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer"],
      {
        css: true,
      }
    ).then(async ([Graphic, GraphicsLayer, FeatureLayer]) => {
      // get city boundary and center point for mapView
      let boundaryPaths, boundaryCenter;
      try {
        const result = await getBoundaryAndCenter(muskokaShapeFileZip);
        boundaryPaths = result.boundaryPaths;
        boundaryCenter = result.boundaryCenter;
      } catch (error) {
        console.log(
          "error in getting result from [getBoundaryAndCenter]",
          error
        );
      }

      // instantiate map and mapView
      const map = await getBaseMap();
      const view = await getMapView(map, boundaryCenter, mapRef.current);

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const lineAndPolyLine = new Graphic({
        // geometry: polyline,
        geometry: {
          type: "polyline",
          paths: boundaryPaths,
        },
        symbol: simpleLineSymbol,
      });

      const boundaryLayer = new FeatureLayer({
        source: lineAndPolyLine,
        popupTemplate: {
          title: "Trail Information",
          content: "This is {L_LADD} with {ELEV_GAIN} ft of climbing.",
        },
        // popupTemplate: {
        // autocasts as new PopupTemplate()
        //   title: "Muskoka Road Network Shapefile: COOPERS FALLS RD",
        //   content: [
        //     // first column
        //     {
        //       type: "fields",
        //       fieldInfos: fieldInfomation,
        //     },
        //   ],
        // },
      });

      // graphicsLayer.add(lineAndPolyLine);
      map.layers.add(boundaryLayer);

      return () => {
        if (view) {
          view.container = null;
        }
      };
    });
  });

  return <div className="webmap" style={{ height: "100vh" }} ref={mapRef} />;
};
