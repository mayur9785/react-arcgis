import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import muskokaShapeFileZip from "../../files/shapeFiles/Muskoka_Road_Network_Shapefile.zip";
import {
  getBoundaryAndCenter,
  getBaseMap,
  getMapView,
  getFieldInfo,
} from "../../containers/mapUtils/mapUtils";
import { styleFont } from "../../containers/mapUtils/mapStyleUtils";

const getFieldInfomation = (properties) => {
  const fieldInfos = [];
  for (const key in properties) {
    if (properties.hasOwnProperty(key)) {
      const fieldInfo = getFieldInfo(key);
      fieldInfos.push(fieldInfo);
    }
  }
  return fieldInfos;
};

const getTableKeyValue = (property) => {
  const copiedProperty = { ...property };
  for (const key in copiedProperty) {
    if (copiedProperty.hasOwnProperty(key)) {
      let element = copiedProperty[key];
      if (!isNaN(element) && element !== "") {
        const twoDecimalString = Number(element).toFixed(2);
        element = parseFloat(twoDecimalString).toLocaleString("en");
      }
      copiedProperty[key] = styleFont(element, "h3");
    }
  }
  return copiedProperty;
};

export const MapWithLineRepresentRoads = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      ["esri/Graphic", "esri/layers/GraphicsLayer", "esri/widgets/LayerList"],
      {
        css: true,
      }
    ).then(async ([Graphic, GraphicsLayer, LayerList]) => {
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

      // instantiate graphics as it is the source of graphics layer
      const boundaryGraphics = boundaryPaths.map((singlePath) => {
        // const propertiesValues = Object.keys(singlePath.properties);

        return new Graphic({
          attributes: getTableKeyValue(singlePath.properties),
          geometry: {
            type: "polyline",
            paths: singlePath.coordinates,
          },
          // symbol: simpleLineSymbol0,
          symbol: {
            type: "simple-line",
            color: [208, 2, 5, 0.8], // orange
            width: 1,
          },
          popupTemplate: {
            // autocasts as new PopupTemplate()
            title: "Muskoka Road Network Shapefile: COOPERS FALLS RD",
            content: [
              {
                type: "fields",
                fieldInfos: getFieldInfomation(boundaryPaths[0].properties),
              },
            ],
          },
          objectIdField: "ObjectId", // This must be defined when creating a layer from `Graphic` objects
        });
      });

      const boundaryGraphicsLayer = new GraphicsLayer({
        title: "lucien demo layer",
        id: "boundaryGraphicLayer",
        graphics: boundaryGraphics,
      });

      // add configured layer to map
      map.add(boundaryGraphicsLayer);

      // layer list
      const layerList = new LayerList({
        view: view,
        listItemCreatedFunction: function (event) {
          const item = event.item;
          item.open = true;
          // displays the legend for each layer list item
          item.panel = {
            content: ["legend"],
          };
        },
      });
      view.ui.add(layerList, "top-left");

      return () => {
        if (view) {
          view.container = null;
        }
      };
    });
  });

  return <div className="webmap" style={{ height: "100vh" }} ref={mapRef} />;
};
