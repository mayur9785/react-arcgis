import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

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
    ).then(([Map, MapView, Graphic, FeatureLayer, LayerList, Legend]) => {
      const map = new Map({
        basemap: "topo-vector",
      });

      // turn places into graphics
      const graphics = places.map((place) => {
        return new Graphic({
          attributes: {
            ObjectId: place.id,
            address: place.address,
            imageUrl: place.imageUrl,
            city: place.city,
          },
          geometry: {
            type: "point",
            longitude: place.longitude,
            latitude: place.latitude,
          },
        });
      });

      const featureLayer = new FeatureLayer({
        title: "Lucien Layer",
        source: graphics,
        renderer: {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            // autocasts as new SimpleMarkerSymbol()
            type: "simple-marker",
            color: "#102A44",
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: "#598DD8",
              width: 2,
            },
          },
          label: "Sample Legend Name",
        },
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title:
            "<img src='https://irisradgroup.maps.arcgis.com/sharing/rest/content/items/1402078d37094752a3632510e7006123/data' style='width: 25px; margin-bottom: -5px'>  <span style='font-size: 1.25rem'>Places in Los Angeles</span>",
          // `<span  style='padding-top: 5px';"><img src='https://irisradgroup.maps.arcgis.com/sharing/rest/content/items/1402078d37094752a3632510e7006123/data' style='width: 25px; padding: 0px'></span>  <span style='font-size: 1.25rem'>Places in Los Angeles</span>`,
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "address",
                  label: "Address",
                  visible: true,
                },
                {
                  fieldName: "imageUrl",
                  label: "Image Url",
                  visible: true,
                },
                {
                  fieldName: "city",
                  label: "city",
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
                  caption: "tree species",
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
        objectIdField: "ObjectID", // This must be defined when creating a layer from `Graphic` objects
        fields: [
          {
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid",
          },
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

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-118.805, 34.027],
        zoom: 13,
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
