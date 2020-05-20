import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

export const MapFilterFeatureData = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/LayerList",
      ],
      { css: true }
    ).then(([Map, MapView, FeatureLayer, LayerList]) => {
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

      var featureLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
        outFields: ["*"], // Return all fields so it can be queried client-side
        popupTemplate: {
          // Enable a popup
          title: "{TRL_NAME}", // Show attribute value
          content: "The trail elevation gain is {ELEV_GAIN} ft.", // Display in pop-up
        },
      });

      map.add(featureLayer);
      const layerList = new LayerList({
        view: view,
        listItemCreatedFunction: function (event) {
          const item = event.item;
          item.open = true;
          // displays the legend for each layer list item
          item.panel = {
            content: ["legend"],
          };
        },
      });
      view.ui.add(layerList, "top-left");

      var sqlExpressions = [
        "TRL_ID = 0",
        "TRL_ID > 0",
        "USE_BIKE = 'Yes'",
        "USE_BIKE = 'No'",
        "ELEV_GAIN < 1000",
        "ELEV_GAIN > 1000",
        "TRL_NAME = 'California Coastal Trail'",
      ];

      var selectFilter = document.createElement("select");
      selectFilter.setAttribute("class", "esri-widget esri-select");
      selectFilter.setAttribute(
        "style",
        "width: 275px; font-family: Avenir Next W00; font-size: 1em;"
      );

      sqlExpressions.forEach(function (sql) {
        var option = document.createElement("option");
        option.value = sql;
        option.innerHTML = sql;
        selectFilter.appendChild(option);
      });

      view.ui.add(selectFilter, "top-right");

      // server side filter
      function setFeatureLayerFilter(expression) {
        featureLayer.definitionExpression = expression;
      }

      // client side filter
      function setFeatureLayerViewFilter(expression) {
        view.whenLayerView(featureLayer).then(function (featureLayerView) {
          // featureLayerView.filter = {
          //   where: expression,
          // };
          featureLayerView.effect = {
            filter: {
              where: expression,
            },
            excludedEffect: "opacity(50%)",
          };
        });
      }

      selectFilter.addEventListener("change", function (event) {
        // setFeatureLayerFilter(event.target.value);
        setFeatureLayerViewFilter(event.target.value);
      });

      // hover effect
      var highlight;

      view.whenLayerView(featureLayer).then(function (featureLayerView) {
        // view.on("pointer-move", function (event) {
        //   view.hitTest(event).then(function (response) {
        //     // Only return features for the feature layer
        //     var feature = response.results.filter(function (result) {
        //       return result.graphic.layer === featureLayer;
        //     })[0].graphic;
        //     if (highlight) {
        //       highlight.remove();
        //     }
        //     // Highlight feature
        //     highlight = featureLayerView.highlight(feature);
        //   });
        // });
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
