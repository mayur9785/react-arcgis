import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

export const MapWithFeatureTable = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/WebMap",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/FeatureTable",
        "esri/geometry/Point",
        "esri/geometry/Multipoint",
        "esri/widgets/LayerList",
      ],
      { css: true }
    ).then(
      ([
        WebMap,
        MapView,
        FeatureLayer,
        FeatureTable,
        Point,
        Multipoint,
        LayerList,
      ]) => {
        const highlights = [];
        const webmap = new WebMap({
          portalItem: {
            id: "3c245fe893234d4f85e4edaa41a9e0bf",
          },
        });

        let view = new MapView({
          container: "viewDiv",
          map: webmap,
          popup: {
            autoOpenEnabled: false,
          }, //disable popups
        });

        view.when(function () {
          const featureLayer = webmap.layers.getItemAt(0); //grabs the first layer in the map
          featureLayer.title = "USFS Recreational areas";

          // Create the feature table
          const featureTable = new FeatureTable({
            layer: featureLayer,
            // Autocast the FieldColumnConfigs
            fieldConfigs: [
              {
                name: "RECAREANAM",
                label: "Recreation area name",
              },
              {
                name: "FORESTNAME",
                label: "Forest name",
                direction: "asc",
              },
              {
                name: "OPENSTATUS",
                label: "Open status",
              },
              {
                name: "OPEN_SEASO",
                label: "Season begins",
              },
              {
                name: "RECAREADES",
                label: "Recreation description",
              },
              {
                name: "RESTRICTIO",
                label: "Restrictions",
              },
            ],
            container: document.getElementById("tableDiv"),
          });

          // Add buttons to the mapView
          view.ui.add(document.getElementById("actions"), "top-right");

          // Get the FeatureLayer's layerView and listen for the table's selection-change event
          // view.whenLayerView(featureLayer).then(function (layerView) {
          //   featureTable.on("selection-change", function (changes) {
          //     // If the selection is removed remove its highlighted feature from the layerView
          //     changes.removed.forEach(function (item) {
          //       const data = highlights.find(function (data) {
          //         return data.feature === item.feature;
          //       });
          //       if (data) {
          //         highlights.splice(highlights.indexOf(data), 1);
          //         data.highlight.remove();
          //       }
          //     });

          //     // If the selection is added, push all added selections to array and highlight on layerView
          //     changes.added.forEach(function (item) {
          //       const feature = item.feature;
          //       const highlight = layerView.highlight(item.feature);
          //       highlights.push({
          //         feature: feature,
          //         highlight: highlight,
          //       });
          //     });
          //   });

          //   const zoomBtn = document.getElementById("zoom");
          //   const fullExtentBtn = document.getElementById("fullextent");

          //   // Wire up button click event listeners
          //   zoomBtn.addEventListener("click", zoomToSelectedFeature);
          //   fullExtentBtn.addEventListener("click", fullExtent);

          //   // fires when "Zoom to selected feature" button is clicked
          //   function zoomToSelectedFeature() {
          //     // Create a query off of the feature layer
          //     const query = featureLayer.createQuery();
          //     // Iterate through the highlights and grab the feature's objectID
          //     const featureIds = highlights.map(function (result) {
          //       return result.feature.getAttribute(featureLayer.objectIdField);
          //     });
          //     // Set the query's objectId
          //     query.objectIds = featureIds;
          //     // Make sure to return the geometry to zoom to
          //     query.returnGeometry = true;
          //     // Call queryFeatures on the feature layer and zoom to the resulting features
          //     featureLayer.queryFeatures(query).then(function (results) {
          //       view.goTo(results.features).catch(function (error) {
          //         if (error.name != "AbortError") {
          //           console.error(error);
          //         }
          //       });
          //     });
          //   }
          //   // Fires when "Full extent" button is clicked
          //   function fullExtent() {
          //     // Zooms to the full extent of the feature layer
          //     view.goTo(featureLayer.fullExtent).catch(function (error) {
          //       if (error.name != "AbortError") {
          //         console.error(error);
          //       }
          //     });
          //   }
          // });
        });

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
        return () => {
          if (view) {
            // destroy the map view
            view.container = null;
          }
        };
      }
    );
  });

  return (
    // <div className="webmap" style={{ height: "100vh" }} ref={mapRef}>
    //   <div id="viewDiv" style={{ height: "50vh" }}></div>
    //   <div className="container">
    //     <div id="tableDiv"></div>
    //   </div>
    //   {/* <div id="actions" className="esri-widget">
    //     <button className="esri-button" id="zoom">
    //       Zoom to selected feature
    //     </button>
    //     <button className="esri-button" id="fullextent">
    //       Full extent
    //     </button>
    //   </div> */}
    // </div>

    <div
      style={{
        height: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        id="viewDiv"
        style={{
          height: "70%",
          width: "100%",
        }}
      ></div>
      <div
        style={{
          height: "30%",
          width: "100%",
        }}
      >
        <div id="tableDiv"></div>
      </div>
    </div>
  );
};
