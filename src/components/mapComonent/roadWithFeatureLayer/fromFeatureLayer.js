import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import muskokaShapeFileZip from "../../../files/shapeFiles/Muskoka_Road_Network_Shapefile.zip";
import {
  getBoundaryAndCenter,
  getBaseMap,
  getMapView,
  getFieldInfo,
  getReducedPaths,
} from "../../../containers/mapUtils/mapUtils";
import { styleFont } from "../../../containers/mapUtils/mapStyleUtils";

const getFieldTitles = (properties) => {
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

const getFieldValue = (property) => {
  const values = [];
  for (const key in property) {
    if (property.hasOwnProperty(key)) {
      const element = property[key];
      values.push({
        name: element.fieldName,
        alias: element.fieldName,
        type: "string",
      });
    }
  }
  return values;
};

// function for property listItemCreatedFunction
// of layer list
const panelFunction = (event) => {
  // const item = event.item;
  // item.open = false;
  // // displays the legend for each layer list item
  // item.panel = {
  //   content: ["legend"],
  // };
  // The event object contains an item property.
  // is is a ListItem referencing the associated layer
  // and other properties. You can control the visibility of the
  // item, its title, and actions using this object.

  const item = event.item;
  item.open = false;
  // displays the legend for each layer list item
  item.panel = {
    content: ["legend"],
  };

  if (item.title === "Roads Layer") {
    // An array of objects defining actions to place in the LayerList.
    // By making this array two-dimensional, you can separate similar
    // actions into separate groups with a breaking line.

    item.actionsSections = [
      [
        {
          title: "Go to full extent",
          className: "esri-icon-zoom-out-fixed",
          id: "full-extent",
        },
        {
          title: "Layer information",
          className: "esri-icon-description",
          id: "information",
        },
      ],
      [
        {
          title: "Increase opacity",
          className: "esri-icon-up",
          id: "increase-opacity",
        },
        {
          title: "Decrease opacity",
          className: "esri-icon-down",
          id: "decrease-opacity",
        },
      ],
    ];
  }
};

const createWorkOrder = {
  title: "create work order",
  id: "create-work-order",
};

const resolve = {
  title: "Resolved",
  id: "measure-this",
};

export const MapWithFeatureLayer = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Graphic",
        "esri/layers/FeatureLayer",
        "esri/widgets/LayerList",
        "esri/layers/GroupLayer",
      ],
      {
        css: true,
      }
    ).then(async ([Graphic, FeatureLayer, LayerList, GroupLayer]) => {
      // instantiate map
      const map = await getBaseMap();

      // instantiate mapView with instantiated center;
      const view = await getMapView(map, undefined, mapRef.current);

      let roadsPaths = []; // roads paths from shapefiele.zip

      // key value pairs as "ROAD_TYPE" : [ROADS]
      let reducedPathsObj = {};

      // get values for roadPaths, boundary center and reducedPaths
      try {
        const result = await getBoundaryAndCenter(muskokaShapeFileZip);

        // all road paths
        roadsPaths = result.boundaryPaths;

        // group all road paths into key: value paris
        // as roadType: pathsOfRoadType
        reducedPathsObj = getReducedPaths(roadsPaths, "ROAD_TYPE");

        // move map to a spcific point
        const boundaryCenter = result.boundaryCenter;
        if (boundaryCenter) {
          view.center = boundaryCenter;
        }
      } catch (error) {
        console.log(
          "error in getting result from [getBoundaryAndCenter]",
          error
        );
      }

      // key-value pair object as
      // roadType: paths
      const roadsGraphicsObj = {};
      for (const roadTypeKey in reducedPathsObj) {
        if (reducedPathsObj.hasOwnProperty(roadTypeKey)) {
          const paths = reducedPathsObj[roadTypeKey];
          const pathsGraphics = paths.map((path) => {
            return new Graphic({
              attributes: getTableKeyValue(path.properties),
              geometry: {
                type: "polyline",
                paths: path.coordinates,
              },
              // symbol: simpleLineSymbol0,
              symbol: {
                type: "simple-line",
                color: [208, 2, 5, 0.8], // orange
                width: 2,
              },
            });
          });
          roadsGraphicsObj[roadTypeKey] = pathsGraphics;
        }
      }

      // get fields titles for table
      const fieldTitleKeys = getFieldTitles(roadsPaths[0].properties);
      // get values type for fields
      const fieldTitleValues = getFieldValue(fieldTitleKeys);

      // contains all road type feature layers
      const layers = [];

      // get a feature layer for each road type
      for (const roadType in roadsGraphicsObj) {
        if (roadsGraphicsObj.hasOwnProperty(roadType)) {
          const pathsGraphics = roadsGraphicsObj[roadType];
          // generate feature layer by given road type
          const roadTypeFeatureLayer = new FeatureLayer({
            title: roadType,
            id: roadType,
            source: pathsGraphics,

            renderer: {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                // autocasts as new SimpleMarkerSymbol()
                type: "simple-line",
                color: [208, 2, 5, 0.8],
                size: 2,
              },
              label: roadType, // lagend name for renderer (legend)
            },
            popupTemplate: {
              // autocasts as new PopupTemplate()
              title:
                "<img src='https://irisradgroup.maps.arcgis.com/sharing/rest/content/items/1402078d37094752a3632510e7006123/data' style='width: 25px; margin-bottom: -5px'>  <span style='font-size: 1.25rem'>Places in Los Angeles</span>",
              content: [
                // first column
                {
                  type: "fields",
                  fieldInfos: fieldTitleKeys,
                },
              ],
              actions: [createWorkOrder, resolve],
            },
            objectIdField: "ObjectID", // This must be defined when creating a layer from `Graphic` objects
            fields: fieldTitleValues,
          });

          layers.push(roadTypeFeatureLayer);
        }
      }

      // a group layer contains all the road type
      // feature layers
      const roadTypesGroupLayer = new GroupLayer({
        id: "roadsGroupLayer",
        title: "Roads Layer",
        layers: layers,
      });

      // add configured layer to map
      // map.layers.add(boundaryGraphicsLayer);
      map.add(roadTypesGroupLayer);

      // layer list for road types
      const roadTypesLayerList = new LayerList({
        view: view,
        listItemCreatedFunction: panelFunction,
        // listItemCreatedFunction: function (event) {
        //   const item = event.item;
        //   item.open = true;
        //   // displays the legend for each layer list item
        //   item.panel = {
        //     content: ["legend"],
        //   };
        // },
      });
      view.ui.add(roadTypesLayerList, "top-left");

      // set up popup listener
      view.popup.on("trigger-action", function (event) {
        // Execute the measureThis() function if the measure-this action is clicked
        if (event.action.id === "create-work-order") {
          const id = getDataIdFromPopup(view.popup, "ID");
          alert(`creating work order for road #: ${id}`);
          debugger;
          // console.log("create-work-order should be executed");
        }
      });

      return () => {
        if (view) {
          view.container = null;
        }
      };
    });
  });

  return <div className="webmap" style={{ height: "100vh" }} ref={mapRef} />;
};
function getDataIdFromPopup(popup, attributeKey) {
  let id = -1;
  const idHTMLValue = popup.content.graphic.attributes[attributeKey];
  if (idHTMLValue) {
    const startIndex = idHTMLValue.indexOf(">");
    const endIndex = idHTMLValue.lastIndexOf("<");
    const tempString = idHTMLValue.substring(startIndex + 1, endIndex);
    const numberString = tempString.split(",").join("");
    id = isNaN(Number(numberString)) ? -1 : Number(numberString);
  }

  return id;
}
