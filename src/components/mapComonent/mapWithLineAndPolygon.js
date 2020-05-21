import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const point = {
  type: "point",
  longitude: -118.80657463861,
  latitude: 34.0005930608889,
};

const simpleMarkerSymbol = {
  type: "simple-marker",
  color: [226, 119, 40], // orange
  outline: {
    color: [255, 255, 255], // white
    width: 1,
  },
};

const simpleLineSymbol = {
  type: "simple-line",
  color: [0, 0, 0], // orange
  width: 2,
};

const polyline = {
  type: "polyline",
  paths: [
    [-118.821527826096, 34.0139576938577],
    [-118.814893761649, 34.0080602407843],
    [-118.808878330345, 34.0016642996246],
  ],
};

const polygon = {
  type: "polygon",
  rings: [
    [-118.818984489994, 34.0137559967283],
    [-118.806796597377, 34.0215816298725],
    [-118.791432890735, 34.0163883241613],
    [-118.79596686535, 34.008564864635],
    [-118.808558110679, 34.0035027131376],
  ],
};

const simpleFillSymbol = {
  type: "simple-fill",
  color: [227, 139, 79, 0.8], // orange, opacity 80%
  outline: {
    color: [255, 255, 255],
    width: 1,
  },
};

// const PopTemplate = () => {
//   return <b>City:</b>;
// };
export const MapWithLineAndPolygon = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
      ],
      { css: true }
    ).then(([ArcGISMap, MapView, Graphic, GraphicsLayer]) => {
      const map = new ArcGISMap({
        basemap: "topo-vector",
      });

      const popTemplate = () => {
        return "<b>City:</b>";
      };

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-118.805, 34.027],
        zoom: 13,
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const pointsAndSymbol = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
        popupTemplate: {
          title: `${point.latitude}`,
        },
      });

      const lineAndPolyLine = new Graphic({
        geometry: polyline,
        symbol: simpleLineSymbol,
      });

      const polygonAndSymbols = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
        popupTemplate: {
          title: "{TRL_NAME}",
          content: popTemplate,
          // content:
          // "<b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft",
        },
      });

      graphicsLayer.add(pointsAndSymbol);
      graphicsLayer.add(lineAndPolyLine);
      graphicsLayer.add(polygonAndSymbols);

      return () => {
        if (view) {
          // destroy the map view
          view.container = null;
        }
      };
    });
  });

  return <div className="webmap" style={{ height: "100vh" }} ref={mapRef} />;
};
