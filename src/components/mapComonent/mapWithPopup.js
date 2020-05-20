import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

export const MapWithPopup = () => {
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

      // define popup
      const popupTrailheads = {
        title: "{TRL_NAME}",
        content:
          "<b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft",
      };

      const trailheads = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
        outFields: ["TRL_NAME", "CITY_JUR", "X_STREET", "PARKING", "ELEV_FT"],
        popupTemplate: popupTrailheads,
      });

      map.add(trailheads);
      // define popup DONE

      // define popup by function
      var popupTrails = {
        title: "Trail Information",
        // dummy content
        // content: function () {
        //   return "This is {TRL_NAME} with {ELEV_GAIN} ft of climbing.";
        // },

        // popup with chart
        // content: [
        //   {
        //     type: "media",
        //     mediaInfos: [
        //       {
        //         type: "column-chart",
        //         caption: "Now you see the chart caption",
        //         value: {
        //           fields: ["ELEV_MIN", "ELEV_MAX"],
        //           normalizeField: null,
        //           tooltipField: "Min and max elevation values",
        //         },
        //       },
        //     ],
        //   },
        // ],

        // use Arcade expression to formate displayed data on popups
        expressionInfos: [
          {
            name: "elevation-ratio",
            title: "Elevation change",
            expression:
              "Round((($feature.ELEV_MAX - $feature.ELEV_MIN)/($feature.LENGTH_MI)/5280)*100,2)",
          },
        ],
        content:
          "The {TRL_NAME} trail average slope per mile is: {expression/elevation-ratio}% over a total of {LENGTH_MI} miles.",
      };

      var trails = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
        outFields: ["TRL_NAME", "ELEV_GAIN"],
        popupTemplate: popupTrails,
      });

      map.add(trails, 0);
      // define popup by function DONE

      // define popup to show a table
      const popupOpenspaces = {
        title: "{PARK_NAME}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "AGNCY_NAME",
                label: "Agency",
                isEditable: true,
                tooltip: "",
                visible: true,
                format: null,
                stringFieldOption: "text-box",
              },
              {
                fieldName: "TYPE",
                label: "Type",
                isEditable: true,
                tooltip: "",
                visible: true,
                format: null,
                stringFieldOption: "text-box",
              },
              {
                fieldName: "ACCESS_TYP",
                label: "Access",
                isEditable: true,
                tooltip: "",
                visible: true,
                format: null,
                stringFieldOption: "text-box",
              },
              {
                fieldName: "GIS_ACRES",
                label: "Acres",
                isEditable: true,
                tooltip: "",
                visible: true,
                format: {
                  places: 2,
                  digitSeparator: true,
                },
                stringFieldOption: "text-box",
              },
            ],
          },
        ],
      };

      const openspaces = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0",
        outFields: [
          "TYPE",
          "PARK_NAME",
          "AGNCY_NAME",
          "ACCESS_TYP",
          "GIS_ACRES",
        ],
        popupTemplate: popupOpenspaces,
      });

      map.add(openspaces, 0);
      // define popup to show a table DONE

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-118.805, 34.027],
        zoom: 14,
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
