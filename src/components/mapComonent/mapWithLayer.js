import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

export const MapWithLayer = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"],
      { css: true }
    ).then(([Map, MapView, FeatureLayer]) => {
      const map = new Map({
        basemap: "topo-vector",
      });

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-118.805, 34.027],
        zoom: 13,
      });

      var trailheadsLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
      });

      map.add(trailheadsLayer);

      //   Trails feature layer (lines)
      var trailsLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
        //*** ADD ***//
        definitionExpression: "ELEV_GAIN < 250",

        //*** ADD ***//
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-line",
            color: "#d00205",
            width: "2px",
          },
        },

        //*** ADD ***//
        outFields: ["TRL_NAME", "ELEV_GAIN"],

        //*** ADD ***//
        popupTemplate: {
          // Enable a popup
          title: "{TRL_NAME}", // Show attribute value
          content: "The trail elevation gain is {ELEV_GAIN} ft.", // Display text in pop-up
        },
      });

      map.add(trailsLayer, 0);

      // Parks and open spaces (polygons)
      var parksLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
      });

      map.add(parksLayer, 0);

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
