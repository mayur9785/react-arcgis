import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

import muskokaShapeFileZip from "../../files/shapeFiles/Muskoka_Road_Network_Shapefile.zip";
const shp = require("shpjs");

const places = [
  {
    id: 1,
    address: "200 N Spring St, Los Angeles, CA 90012",
    imageUrl: "www.google.com",
    longitude: -118.805,
    latitude: 34.05389,
    city: "Montreal",
  },
  {
    id: 2,
    address: "419 N Fairfax Ave, Los Angeles, CA 90036",
    imageUrl: "www.baidu.com",
    longitude: -118.31966,
    latitude: 34.13375,
    city: '<a href="url">link text</a>',
  },
];

const getPlaceFromGeojson = (geojson) => {};

export const MapFeatureLayerWithLocalData = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/FeatureLayer",
        "esri/widgets/LayerList",
        "esri/widgets/Legend",
      ],
      { css: true }
    ).then(async ([Map, MapView, Graphic, FeatureLayer, LayerList, Legend]) => {
      const places0 = [];

      await shp(muskokaShapeFileZip).then((geojsons) => {
        const { features } = geojsons;
        features.map((feature, index) => {
          const coordinates = feature.geometry.coordinates;
          const targetCoordinate = coordinates[0];
          places0.push({
            id: index,
            address: "200 N Spring St, Los Angeles, CA 90012",
            imageUrl: "www.google.com",
            longitude: targetCoordinate[0],
            latitude: targetCoordinate[1],
            city: "Montreal",
          });
          // console.log("coordinates", coordinates);
        });
        console.log("places0", places0);
      });
      const map = new Map({
        basemap: "topo-vector",
      });
      // turn places into graphics
      const graphics = places0.map((place, index) => {
        return new Graphic({
          attributes: {
            // ObjectId: place.id,
            address: `<h1>${place.address}</h1>`,
            imageUrl: `<h1>${place.imageUrl}</h1>`,
            city: `<h1>${place.city}</h1>`,
          },
          geometry: {
            type: "point",
            longitude: place.longitude,
            latitude: place.latitude,
          },
        });
      });

      var shapeFileLayer = new FeatureLayer({
        url:
          "https://services8.arcgis.com/JOTTuViCh6VvErd7/arcgis/rest/services/Muskoka_Road_Network_Shapefile/FeatureServer",
      });
      const featureLayer = new FeatureLayer({
        title: "Lucien Layer",
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-marker",
            style: "esriSLSSolid",
            color: [165, 83, 183, 255],
            width: 1,
          },
        },
        transparency: 0,
        labelingInfo: null,
        source: graphics,
        // renderer: {
        //   type: "simple", // autocasts as new SimpleRenderer()
        //   symbol: {
        //     // autocasts as new SimpleMarkerSymbol()
        //     type: "simple-marker",
        //     color: "#102A44",
        //     outline: {
        //       // autocasts as new SimpleLineSymbol()
        //       color: "#598DD8",
        //       width: 2,
        //     },
        //   },
        //   label: "Sample Legend Name",
        // },
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title:
            "<img src='https://irisradgroup.maps.arcgis.com/sharing/rest/content/items/1402078d37094752a3632510e7006123/data' style='width: 25px; margin-bottom: -5px'>  <span style='font-size: 1.25rem'>Places in Los Angeles</span>",
          content: [
            // first column
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "address",
                  label: "<h1>Address</h1>",
                  visible: true,
                },
                {
                  fieldName: "imageUrl",
                  label: "<h1>Image Url</h1>",
                  visible: true,
                },
                {
                  fieldName: "city",
                  label: "<h1>City</h1>",
                  visible: true,
                },
              ],
            },
            {
              type: "media",
              // Autocasts as array of MediaInfo objects
              mediaInfos: [
                {
                  title: "<b>Mexican Fan Palm</b>",
                  type: "image", // Autocasts as new ImageMediaInfo object
                  caption:
                    "<a href=https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg><h1>tree species</h1></a>",
                  // Autocasts as new ImageMediaInfoValue object
                  value: {
                    sourceURL:
                      "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
                  },
                },
              ],
            },
          ],
        },
        objectIdField: "abc", // This must be defined when creating a layer from `Graphic` objects
        fields: [
          {
            name: "address",
            alias: "address",
            type: "string",
          },
          {
            name: "imageUrl",
            alias: "image url",
            type: "string",
          },
          {
            name: "city",
            alias: "City",
            type: "xml",
          },
        ],
      });

      map.layers.add(featureLayer);
      map.layers.add(shapeFileLayer);

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-79.54677244348377, 45.11037218901963],
        zoom: 13,
      });
      console.log("places0[0].latitude", places0[0].latitude);
      console.log("places0[0].longitude", places0[0].longitude);

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
      var legend = new Legend({
        view: view,
        layerInfos: [
          {
            layer: featureLayer,
            title: "Legend",
          },
        ],
      });

      view.ui.add(legend, "bottom-right");
      // alert(map.layers.length);
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
