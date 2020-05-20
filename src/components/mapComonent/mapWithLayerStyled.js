import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

export const MapWithLayerStyled = () => {
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

      const trailheadsRenderer = {
        type: "simple", // render type
        symbol: {
          // symbol style
          type: "picture-marker",
          url:
            "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
          width: "18px",
          height: "18px",
        },
      };

      const trailheadsLabels = {
        symbol: {
          type: "text",
          color: "#FFFFFF",
          haloColor: "#5E8D74",
          haloSize: "2px",
          font: {
            size: "12px",
            family: "Noto Sans",
            style: "italic",
            weight: "normal",
          },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: "$feature.TRL_NAME",
        },
      };

      const trailheads = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
        renderer: trailheadsRenderer,
        labelingInfo: [trailheadsLabels],
      });

      map.add(trailheads);

      const trailsRenderer = {
        type: "simple",
        symbol: {
          color: "#d00205",
          type: "simple-line",
          style: "solid",
        },
        visualVariables: [
          {
            type: "size",
            field: "ELEV_GAIN",
            minDataValue: 0,
            maxDataValue: 2300,
            minSize: "3px",
            maxSize: "7px",
          },
        ],
      };

      const trails = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
        renderer: trailsRenderer,
        opacity: 0.75,
      });

      map.add(trails, 0);

      const bikeTrailsRenderer = {
        type: "simple",
        symbol: {
          type: "simple-line",
          style: "short-dot",
          color: "#FF91FF",
          width: "1px",
        },
      };

      const bikeTrails = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
        renderer: bikeTrailsRenderer,
        definitionExpression: "USE_BIKE = 'YES'",
      });

      map.add(bikeTrails, 1);

      function createFillSymbol(value, color) {
        return {
          value: value,
          symbol: {
            color: color,
            type: "simple-fill",
            style: "solid",
            outline: {
              style: "none",
            },
          },
          label: value,
        };
      }

      const openSpacesRenderer = {
        type: "unique-value",
        field: "TYPE",
        uniqueValueInfos: [
          createFillSymbol("Natural Areas", "#9E559C"),
          createFillSymbol("Regional Open Space", "#A7C636"),
          createFillSymbol("Local Park", "#149ECE"),
          createFillSymbol("Regional Recreation Park", "#ED5151"),
        ],
      };

      var openspaces = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
        renderer: openSpacesRenderer,
        opacity: 0.2,
      });

      map.add(openspaces, 0);

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
    });
  });

  return <div className="webmap" style={{ height: "100vh" }} ref={mapRef} />;
};
