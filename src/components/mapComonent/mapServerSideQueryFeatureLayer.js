import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

export const MapServerSideQueryFeatureLayer = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
      ],
      { css: true }
    ).then(([ArcGISMap, MapView, FeatureLayer, GraphicsLayer, Graphic]) => {
      const map = new ArcGISMap({
        basemap: "topo-vector",
      });

      // add layer
      // Reference the feature layer to query
      const featureLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
      });

      // Layer used to draw graphics returned from the query
      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);
      // add layer DONE

      function addGraphics(result) {
        graphicsLayer.removeAll();
        result.features.forEach(function (feature) {
          var g = new Graphic({
            geometry: feature.geometry,
            attributes: feature.attributes,
            symbol: {
              type: "simple-marker",
              color: [0, 0, 0],
              outline: {
                width: 2,
                color: [0, 255, 255],
              },
              size: "20px",
            },
            popupTemplate: {
              title: "{TRL_NAME}",
              content: "This a {PARK_NAME} trail located in {CITY_JUR}.",
            },
          });
          graphicsLayer.add(g);
        });
      }

      function queryFeatureLayer(
        point,
        distance,
        spatialRelationship,
        sqlExpression
      ) {
        debugger;
        var query = {
          geometry: point,
          distance: distance,
          spatialRelationship: spatialRelationship,
          outFields: ["*"],
          returnGeometry: true,
          where: sqlExpression,
        };
        featureLayer.queryFeatures(query).then(function (result) {
          addGraphics(result, true);
        });
      }

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-118.805, 34.027],
        zoom: 13,
      });

      view.when(function () {
        queryFeatureLayer(view.center, 1500, "intersects");
      });

      view.on("click", function (event) {
        queryFeatureLayer(event.mapPoint, 1500, "intersects");
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
