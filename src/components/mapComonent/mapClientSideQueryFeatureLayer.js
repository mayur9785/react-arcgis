import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

export const MapClientSideQueryFeatureLayer = () => {
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

      function queryFeatureLayerView(
        point,
        distance,
        spatialRelationship,
        sqlExpression
      ) {
        // Add the layer if it is missing
        if (!map.findLayerById(featureLayer.id)) {
          featureLayer.outFields = ["*"];
          map.add(featureLayer, 0);
        }
        // Set up the query
        var query = {
          geometry: point,
          distance: distance,
          spatialRelationship: spatialRelationship,
          outFields: ["*"],
          returnGeometry: true,
          where: sqlExpression,
        };
        // Wait for the layerview to be ready and then query features
        view.whenLayerView(featureLayer).then(function (featureLayerView) {
          if (featureLayerView.updating) {
            var handle = featureLayerView.watch("updating", function (
              isUpdating
            ) {
              // was updating and now is done
              if (!isUpdating) {
                // Execute the query
                featureLayerView.queryFeatures(query).then(function (result) {
                  addGraphics(result);
                });
                handle.remove();
              }
            });
          } else {
            // updating was done
            // Execute the query
            featureLayerView.queryFeatures(query).then(function (result) {
              addGraphics(result);
            });
          }
        });
      }

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-118.805, 34.027],
        zoom: 13,
      });

      const sql = "TRL_NAME like '%Canyon%'";

      view.when(function () {
        queryFeatureLayerView(view.center, 1500, "intersects", sql);
      });

      view.when(function () {
        view.whenLayerView(featureLayer).then(function () {
          view.on("pointer-move", function (event) {
            view.hitTest(event).then(function (response) {
              // Only return features for the feature layer
              var feature = response.results.filter(function (result) {
                return result.graphic.layer === featureLayer;
              })[0].graphic;
              if (feature) {
                // Show popup for new features only
                if (
                  !view.popup.features.length ||
                  (view.popup.features.length &&
                    view.popup.features[0].attributes.FID !==
                      feature.attributes.FID)
                ) {
                  view.popup.open({
                    title: feature.attributes.TRL_NAME,
                    content:
                      "This a " +
                      feature.attributes.PARK_NAME +
                      " trail located in " +
                      feature.attributes.CITY_JUR +
                      ".",
                    location: feature.geometry,
                  });
                }
              }
            });
          });
        });
      });

      view.on("click", function (event) {
        queryFeatureLayerView(event.mapPoint, 1500, "intersects", sql);
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
