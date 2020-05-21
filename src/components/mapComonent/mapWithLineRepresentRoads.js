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

const fontStyleTage = "h2";

const fieldInfomation = [
  {
    fieldName: "NAME",
    label: styleFont("Name", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "SUFFIX",
    label: styleFont("Suffix", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "DIRECTION",
    label: styleFont("direction", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "L_LADD",
    label: styleFont("L_LADD", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "L_HADD",
    label: styleFont("L_HADD", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "R_LADD",
    label: styleFont("R_LADD", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "R_HADD",
    label: styleFont("L_HADD", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "L_MUNICIPA",
    label: styleFont("L_MUNICIPA", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "R_MUNICIPA",
    label: styleFont("R_MUNICIPA", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "ROAD_TYPE",
    label: styleFont("Road Type", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "NID",
    label: styleFont("NID", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "ROAD_NAME",
    label: styleFont("Road Name", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "ROAD_ALLIAS",
    label: styleFont("Road Allias", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "O_Range",
    label: styleFont("O Range", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "Urban_Area",
    label: styleFont("Urban Area", fontStyleTage),
    visible: true,
  },
  {
    fieldName: "Oneway",
    label: styleFont("Oneway", fontStyleTage),
    visible: true,
  },
];

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
        console.log("element", element);
        const twoDecimalString = Number(element).toFixed(2);
        element = parseFloat(twoDecimalString).toLocaleString("en");
      }
      copiedProperty[key] = styleFont(element, "h3");
    }
  }
  debugger;
  return copiedProperty;
};

export const MapWithLineRepresentRoads = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(["esri/Graphic", "esri/layers/GraphicsLayer"], {
      css: true,
    }).then(async ([Graphic, GraphicsLayer]) => {
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
          // attributes: {
          //   address: `<h1>${singlePath.address}</h1>`,
          //   imageUrl: `<h1>${singlePath.imageUrl}</h1>`,
          //   city: `<h1>${singlePath.city}</h1>`,
          // },
          // attributes: singlePath.properties,
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
              // first column
              {
                type: "fields",

                // fieldInfos: fieldInfomation,
                fieldInfos: getFieldInfomation(boundaryPaths[0].properties),
                // fieldInfos: [
                //   {
                //     fieldName: "city",
                //     label: "<h1>City</h1>",
                //     visible: true,
                //   },
                //   {
                //     fieldName: "address",
                //     label: "<h1>Address</h1>",
                //     visible: true,
                //   },

                //   {
                //     fieldName: "imageUrl",
                //     label: "<h1>Image Url</h1>",
                //     visible: true,
                //   },
                // ],
              },
            ],
          },
          objectIdField: "ObjectId", // This must be defined when creating a layer from `Graphic` objects
        });
      });

      const boundaryGraphicsLayer = new GraphicsLayer({
        id: "boundaryGraphicLayer",
        graphics: boundaryGraphics,
      });

      // const points = []
      // for(let i = 0; i < 100; i++) {
      //   points.push(new Graphic({
      //     geometry: {
      //       type: "point",
      //       longitude: -118.80657463861,
      //       latitude: 34.0005930608889,
      //     },
      //     symbol: {
      //       type: "simple-marker",
      //       color: [226, 119, 40], // orange
      //       outline: {
      //         color: [255, 255, 255], // white
      //         width: 1,
      //       },
      //     },
      //   }))
      // }
      // const boundaryGraphicsLayer = new GraphicsLayer({
      //   id: "boundaryGraphicLayer",
      //   graphics: [
      //     new Graphic({
      //       geometry: {
      //         type: "point",
      //         longitude: -118.80657463861,
      //         latitude: 34.0005930608889,
      //       },
      //       symbol: {
      //         type: "simple-marker",
      //         color: [226, 119, 40], // orange
      //         outline: {
      //           color: [255, 255, 255], // white
      //           width: 1,
      //         },
      //       },
      //     }),
      //   ],
      // });
      debugger;
      // add configured layer to map
      map.add(boundaryGraphicsLayer);

      return () => {
        if (view) {
          view.container = null;
        }
      };
    });
  });

  return <div className="webmap" style={{ height: "100vh" }} ref={mapRef} />;
};
