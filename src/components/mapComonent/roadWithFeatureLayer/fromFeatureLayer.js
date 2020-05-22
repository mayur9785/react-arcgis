import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import muskokaShapeFileZip from "../../../files/shapeFiles/Muskoka_Road_Network_Shapefile.zip";
import {
  getBoundaryAndCenter,
  getBaseMap,
  getMapView,
  getFieldInfo,
} from "../../../containers/mapUtils/mapUtils";
import { styleFont } from "../../../containers/mapUtils/mapStyleUtils";

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

const panelFunction = (event) => {
  // The event object contains an item property.
  // is is a ListItem referencing the associated layer
  // and other properties. You can control the visibility of the
  // item, its title, and actions using this object.

  var item = event.item;
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

      const map = await getBaseMap();
      const view = await getMapView(map, boundaryCenter, mapRef.current);

      // instantiate graphics as it is the source of graphics layer
      const boundaryGraphics = boundaryPaths.map((singlePath) => {
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
        });
      });

      const fi = getFieldInfomation(boundaryPaths[0].properties);
      const fivalue = getFieldValue(fi);

      const boundaryGraphicsLayer = new FeatureLayer({
        title: "lucien demo layer",
        id: "boundaryGraphicLayer",
        source: boundaryGraphics,

        renderer: {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            // autocasts as new SimpleMarkerSymbol()
            type: "simple-line",
            color: [208, 2, 5, 0.8],
            size: 2,
          },
          label: "Sample Legend Name", // lagend name for renderer (legend)
        },
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title:
            "<img src='https://irisradgroup.maps.arcgis.com/sharing/rest/content/items/1402078d37094752a3632510e7006123/data' style='width: 25px; margin-bottom: -5px'>  <span style='font-size: 1.25rem'>Places in Los Angeles</span>",
          content: [
            // first column
            {
              type: "fields",
              fieldInfos: fi,
            },
            // {
            //   type: "media",
            //   // Autocasts as array of MediaInfo objects
            //   mediaInfos: [
            //     {
            //       title: "<b>Mexican Fan Palm</b>",
            //       type: "image", // Autocasts as new ImageMediaInfo object
            //       caption:
            //         "<a href=https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg><h1>tree species</h1></a>",
            //       // Autocasts as new ImageMediaInfoValue object
            //       value: {
            //         sourceURL:
            //           "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
            //       },
            //     },
            //   ],
            // },
          ],
        },
        objectIdField: "ObjectID", // This must be defined when creating a layer from `Graphic` objects
        fields: fivalue,
      });
      const boundaryGraphicsLayer0 = new FeatureLayer({
        title: "lucien demo layer",
        id: "boundaryGraphicLayer",
        source: boundaryGraphics,

        renderer: {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            // autocasts as new SimpleMarkerSymbol()
            type: "simple-line",
            color: [0, 2, 5, 0.8],
            size: 2,
          },
          label: "Sample Legend Name", // lagend name for renderer (legend)
        },
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title:
            "<img src='https://irisradgroup.maps.arcgis.com/sharing/rest/content/items/1402078d37094752a3632510e7006123/data' style='width: 25px; margin-bottom: -5px'>  <span style='font-size: 1.25rem'>Places in Los Angeles</span>",
          content: [
            // first column
            {
              type: "fields",
              fieldInfos: fi,
            },
            // {
            //   type: "media",
            //   // Autocasts as array of MediaInfo objects
            //   mediaInfos: [
            //     {
            //       title: "<b>Mexican Fan Palm</b>",
            //       type: "image", // Autocasts as new ImageMediaInfo object
            //       caption:
            //         "<a href=https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg><h1>tree species</h1></a>",
            //       // Autocasts as new ImageMediaInfoValue object
            //       value: {
            //         sourceURL:
            //           "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
            //       },
            //     },
            //   ],
            // },
          ],
        },
        objectIdField: "ObjectID", // This must be defined when creating a layer from `Graphic` objects
        fields: fivalue,
      });

      const gl = new GroupLayer({
        id: "roadsGroupLayer",
        title: "Roads Layer",
        layers: [boundaryGraphicsLayer, boundaryGraphicsLayer0],
      });

      // add configured layer to map
      // map.layers.add(boundaryGraphicsLayer);
      map.add(gl);

      // layer list
      const layerList = new LayerList({
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
