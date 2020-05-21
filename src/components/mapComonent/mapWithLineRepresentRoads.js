import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import muskokaShapeFileZip from "../../files/shapeFiles/Muskoka_Road_Network_Shapefile.zip";
import {
  getBoundaryAndCenter,
  getBaseMap,
  getMapView,
} from "../../containers/mapUtils/mapUtils";
import { styleFont } from "../../containers/mapUtils/mapStyleUtils";
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
// const fontStyleTage = "h2";

// const fieldInfomation = [
//   {
//     fieldName: "name",
//     label: styleFont("Name", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "Suffix",
//     label: styleFont("Suffix", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "direction",
//     label: styleFont("direction", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "L_LADD",
//     label: styleFont("L_LADD", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "L_HADD",
//     label: styleFont("L_HADD", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "R_LADD",
//     label: styleFont("R_LADD", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "R_HADD",
//     label: styleFont("L_HADD", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "L_MUNICIPA",
//     label: styleFont("L_MUNICIPA", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "R_MUNICIPA",
//     label: styleFont("R_MUNICIPA", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "ROAD_TYPE",
//     label: styleFont("Road Type", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "NID",
//     label: styleFont("NID", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "ROAD_NAME",
//     label: styleFont("Road Name", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "ROAD_ALLIAS",
//     label: styleFont("Road Allias", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "O_Range",
//     label: styleFont("O Range", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "Urban_Area",
//     label: styleFont("Urban Area", fontStyleTage),
//     visible: true,
//   },
//   {
//     fieldName: "Oneway",
//     label: styleFont("Oneway", fontStyleTage),
//     visible: true,
//   },
// ];

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
      debugger;
      const boundaryGraphics = boundaryPaths.map((singlePath, index) => {
        return new Graphic({
          // attributes: {
          //   ObjectId: index,
          //   // address: `<h1>${singlePath.address}</h1>`,
          //   // imageUrl: `<h1>${singlePath.imageUrl}</h1>`,
          //   // city: `<h1>${singlePath.city}</h1>`,
          // },
          geometry: {
            type: "polyline",
            paths: singlePath,
          },
          // symbol: simpleLineSymbol0,
          symbol: {
            type: "simple-line",
            color: [208, 2, 5, 0.8], // orange
            width: 1,
          },
          // popupTemplate: {
          //   // autocasts as new PopupTemplate()
          //   title: "Muskoka Road Network Shapefile: COOPERS FALLS RD",
          //   content: [
          //     // first column
          //     {
          //       type: "fields",
          //       fieldInfos: fieldInfomation,
          //     },
          //   ],
          // },
          // objectIdField: "ObjectID", // This must be defined when creating a layer from `Graphic` objects
          // fields: [
          //   {
          //     name: "ObjectID",
          //     alias: "ObjectID",
          //     type: "oid",
          //   },
          //   {
          //     name: "address",
          //     alias: "address",
          //     type: "string",
          //   },
          //   {
          //     name: "imageUrl",
          //     alias: "image url",
          //     type: "string",
          //   },
          //   {
          //     name: "city",
          //     alias: "City",
          //     type: "xml",
          //   },
          // ],
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
