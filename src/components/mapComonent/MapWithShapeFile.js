import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
// import muskokaShapeFile from "../../files/shapeFiles/Muskoka_Road_Network.shp";
import muskokaShapeFile from "../../files/shapeFiles/Muskoka_Civic_Address.shp";
// import muskokaShapeFile from "./points.shp";
const shapeFile = require("shapefile");

export const MapWithShapeFile = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(["esri/Map", "esri/views/MapView"], { css: true }).then(
      ([ArcGISMap, MapView]) => {
        const map = new ArcGISMap({
          basemap: "topo-vector",
        });
        const sf = [];
        shapeFile
          .open(muskokaShapeFile)
          .then((source) => {
            source.read().then(function log(result) {
              console.log("logged");
              if (result.done) {
                console.log("sf", sf);
                return;
              }
              console.log(result.value);
              sf.push(result.value);
              return source.read().then(log);
            });
          })
          .catch((error) => console.error(error.stack));

        // load the map view at the ref's DOM node
        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [-118.805, 34.027],
          zoom: 13,
        });

        return () => {
          if (view) {
            // destroy the map view
            view.container = null;
          }
        };
      }
    );
  });

  return <div className="webmap" style={{ height: "100vh" }} ref={mapRef} />;
};
