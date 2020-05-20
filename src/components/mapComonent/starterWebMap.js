import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

export const StarterWebMap = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/WebMap",
        "esri/layers/FeatureLayer",
      ],
      {
        css: true,
      }
    ).then(([Map, MapView, WebMap]) => {
      var webmap = new WebMap({
        portalItem: {
          // autocasts as new PortalItem()
          // id: "f2e9b762544945f390ca4ac3671cfa72",
          // id: "1e8f06d9ee474b349b7ceb29a448538d",
          id: "d806e825565043c89c6422c6095b03b6",
        },
      });

      var view = new MapView({
        map: webmap,
        container: mapRef.current,
      });

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
