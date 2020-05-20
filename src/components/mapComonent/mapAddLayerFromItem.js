import React, { useEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";

export const MapAddLayFromItem = () => {
  const mapRef = useRef();

  useEffect(() => {
    loadModules(["esri/Map", "esri/views/MapView", "esri/layers/Layer"], {
      css: true,
    }).then(([ArcGISMap, MapView, Layer]) => {
      const map = new ArcGISMap({ basemap: "topo-vector" });

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-140.805, 34.027],
        zoom: 13,
      });

      const addLayer = (layerItemPromise, index) => {
        return layerItemPromise.then(function (layer) {
          map.add(layer, index);
        });
      };

      var trailheadsPortalItem = Layer.fromPortalItem({
        portalItem: {
          id: "33fc2fa407ab40f9add12fe38d5801f5",
        },
      });

      //*** ADD ***//

      // Trails
      var trailsPortalItem = Layer.fromPortalItem({
        portalItem: {
          id: "52a162056a2d48409fc3b3cbb672e7da",
        },
      });

      // Parks
      var parksPortalItem = Layer.fromPortalItem({
        portalItem: {
          id: "83cf97eea04e4a699689c250dd07b975",
        },
      });

      //*** ADD ***//

      addLayer(trailheadsPortalItem, 2)
        .then(addLayer(trailsPortalItem, 1))
        .then(addLayer(parksPortalItem, 0));

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
