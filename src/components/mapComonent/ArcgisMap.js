import React, { useEffect, useRef, useState, useContext } from "react";
import { loadModules } from "esri-loader";
import shapeGeoJson from "../mapComonent/hamiltonDataFilterDemo/Muskoka_Road_Network.json";
import dataPointJson from "../mapComonent/hamiltonDataFilterDemo/data.json";

import { LAYER_FILTER_TYPES } from "../../constants/mapConstants";
import {
  getBaseMap,
  getMapView,
  getFieldInfo,
  getReducedPaths,
  getGraphicObj,
  LAYER_TYPES,
  getRandomRGB,
  getSimpleMarkerSymbol,
  getIconRenderer,
  getGroupedDataPoints,
  getGroupedDataPointsGraphics,
} from "../../containers/mapUtils/mapUtils.js";
import { isValidObj, leftJoin } from "../../utils/utilFunctions/utilFunctions";
import { MapContext } from "../../context/mapContext";

import redWarningIcon from "../../images/mms_warning.jpg";
import yellowWarningIcon from "../../images/rri_warning.jpg";
import moreDetailsIcon from "../../images/more_details.png";

const roadGraphicOptions = {
  graphicType: "polyline",
  graphicSymbol: {
    type: "simple-line",
    color: [208, 2, 5, 0.8], // orange
    width: 2,
  },
};

const getRoadGraphicOptions = () => ({
  graphicType: "polyline",
  graphicSymbol: {
    type: "simple-line",
    // color: [208, 2, 5, 0.8], // orange
    color: getRandomRGB(0.8),
    width: 2,
  },
});

const getFieldTitles = (properties) => {
  const fieldInfos = [];
  for (const key in properties) {
    if (properties.hasOwnProperty(key)) {
      const fieldInfo = getFieldInfo(key);
      fieldInfos.push(fieldInfo);
    }
  }
  return fieldInfos;
};

const getFieldValue = (property) => {
  const values = [];
  for (const key in property) {
    if (property.hasOwnProperty(key)) {
      const element = property[key];
      values.push({
        name: element.fieldName,
        alias: element.fieldName,
        type: "string",
      });
    }
  }
  return values;
};

function getRoadFeatureLayerRenderer(legendName) {
  return {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      // autocasts as new SimpleMarkerSymbol()
      type: "simple-line",
      // color: [208, 2, 5, 0.8],
      color: getRandomRGB(0.8),
      width: 2,
    },
    label: legendName, // lagend name for renderer (legend)
  };
}

// function for property listItemCreatedFunction
// of layer list
const panelFunction = (event) => {
  // const item = event.item;
  // item.open = false;
  // // displays the legend for each layer list item
  // item.panel = {
  //   content: ["legend"],
  // };
  // The event object contains an item property.
  // is is a ListItem referencing the associated layer
  // and other properties. You can control the visibility of the
  // item, its title, and actions using this object.

  const item = event.item;
  item.open = false;
  // displays the legend for each layer list item
  item.panel = {
    content: ["legend"],
  };
};

export const ArcgisMap = (props) => {
  const { values, setters } = useContext(MapContext);
  const {
    mapType,
    dataGroupType,
    layerFilterTypes,
    selectedData,
    selectedDate,
    selectedLayers,
    zoomToSelectedData,
  } = values;
  const {
    setMapType,
    setDataGroupType,
    setSelectedData,
    setSelectedDate,
    setSelectedLayers,
    setZoomToSelectedData,
    setOpenPanel,
    setSelectedPanelIndex,
  } = setters;

  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [mapView, setMapView] = useState(null);

  const [allGroupLayers, setAllGroupLayers] = useState([]);

  function getDataPointGroupLayer(
    id, // id for the root group layer
    filterType,
    GraphicClass,
    FeatureLayerClass,
    GroupLayerClass
  ) {
    if (
      !isValidObj(GraphicClass) ||
      !isValidObj(FeatureLayerClass) ||
      !isValidObj(GroupLayerClass)
    ) {
      return {};
    }

    // get groupedDataPoints as
    // {
    //   filterTypeKey0 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
    //   filterTypeKey1 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
    //   filterTypeKey2 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
    //   filterTypeKey3 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
    // }
    const groupedDataPoints = getGroupedDataPoints(filterType, dataPointJson);

    // get groupedDataPointsGraphics as
    // {
    //   filterTypeKey0 : { no issues: [graphicObjects], rri: [graphicObjects] mms: [graphicObjects] red flag: [graphicObjects] yellow falg: [graphicObjects] },
    //   filterTypeKey1 : { no issues: [graphicObjects], rri: [graphicObjects] mms: [graphicObjects] red flag: [graphicObjects] yellow falg: [graphicObjects] },
    //   filterTypeKey2 : { no issues: [graphicObjects], rri: [graphicObjects] mms: [graphicObjects] red flag: [graphicObjects] yellow falg: [graphicObjects] },
    //   filterTypeKey3 : { no issues: [graphicObjects], rri: [graphicObjects] mms: [graphicObjects] red flag: [graphicObjects] yellow falg: [graphicObjects] },
    // }
    const groupdedDataPointsGraphics = getGroupedDataPointsGraphics(
      groupedDataPoints,
      GraphicClass
    );
    debugger;

    // get graphic objects from grouped data points

    // get groupedDataPointsGraphics as
    // [groupLayer0, groupLayer1, ...]
    // where each group layer consists of an array of feature layers where, again,
    // each of them consists of an array of graphics
    // const dataPointLayers = {};
    const groupLayers = [];
    for (const key in groupdedDataPointsGraphics) {
      if (groupdedDataPointsGraphics.hasOwnProperty(key)) {
        const element = groupdedDataPointsGraphics[key];
        const featureLayers = [];
        for (const dataPointTitle in element) {
          if (element.hasOwnProperty(dataPointTitle)) {
            const pathsGraphics = element[dataPointTitle];

            let featureLayerRenderer = {};
            switch (dataPointTitle) {
              case LAYER_FILTER_TYPES["Red Flag"].name:
                featureLayerRenderer = getIconRenderer(
                  redWarningIcon,
                  dataPointTitle,
                  25
                );
                break;
              case LAYER_FILTER_TYPES["Yellow Flag"].name:
                featureLayerRenderer = getIconRenderer(
                  yellowWarningIcon,
                  dataPointTitle,
                  25
                );
                break;

              default:
                let markerSymbol = getSimpleMarkerSymbol(dataPointTitle);
                featureLayerRenderer = {
                  type: "simple",
                  symbol: markerSymbol,
                  label: dataPointTitle,
                };
            }

            const roadTypeFeatureLayer = new FeatureLayerClass({
              id: dataPointTitle,
              title: dataPointTitle,
              source: pathsGraphics,
              renderer: featureLayerRenderer,
              popupTemplate: {
                title: "( {latitude}, {longitude} )",
                content: [
                  {
                    type: "text",
                    text: `
                <h1>id: {id}</h1>
                <h1>damage type: {damage_type}</h1>
                <h1>road related issues: {road_related_issues}</h1>
                `,
                  },
                  {
                    type: "media",
                    // Autocasts as array of MediaInfo objects
                    mediaInfos: [
                      {
                        title: "<b>{address}</b>",
                        type: "image", // Autocasts as new ImageMediaInfo object// Autocasts as new ImageMediaInfoValue object
                        value: {
                          sourceURL: "{image}",
                        },
                      },
                    ],
                  },
                ],
                actions: [
                  {
                    title: "Details",
                    id: "create-work-order",
                    image: `${moreDetailsIcon}`,
                  },
                ],
              },
              fields: [
                {
                  name: "id",
                  alias: "id",
                  type: "string",
                },
                {
                  name: "address",
                  alias: "address",
                  type: "string",
                },
                {
                  name: "image",
                  alias: "image",
                  type: "string",
                },
                {
                  name: "latitude",
                  alias: "latitude",
                  type: "string",
                },
                {
                  name: "longitude",
                  alias: "longitude",
                  type: "string",
                },
                {
                  name: "road_related_issues",
                  alias: "road_related_issues",
                  type: "string",
                },
                {
                  name: "damage_type",
                  alias: "damage_type",
                  type: "string",
                },
              ],
              objectIdField: "dataPointObjectID", // This must be defined when creating a layer from `Graphic` objects
            });
            featureLayers.push(roadTypeFeatureLayer);
          }
        }
        const subgroupLayer = new GroupLayerClass({
          id: key, // id for sub group layer
          title: `${key}:\n(filter by ${filterType})`,
          layers: featureLayers,
        });
        groupLayers.push(subgroupLayer);
      }
    }

    // make the root group layer consists of [groupLayer0, groupLayer1, ...]
    // so that each groupLayer would be a sub group layer of the
    // root group layer
    const dataPointGroupLayer = new GroupLayerClass({
      id: id,
      title: `${id}:\n(filter by ${filterType})`,
      layers: groupLayers,
    });
    return dataPointGroupLayer;
  }

  // let GraphicClass = null;

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Graphic",
        "esri/layers/FeatureLayer",
        "esri/widgets/LayerList",
        "esri/layers/GroupLayer",
      ],
      {
        css: true,
      }
    ).then(async ([Graphic, FeatureLayer, LayerList, GroupLayer]) => {
      const allLayers = [];
      // instantiate map
      const map = await getBaseMap(mapType);

      // instantiate mapView with instantiated center;
      const view = await getMapView(map, undefined, mapRef.current);

      setMap(map);
      setMapView(view);

      // instantiate mapView with instantiated center;

      // ==================================================== first layer ===============================================================
      let roadsPaths = []; // roads paths from shapefiele.zip

      // key value pairs as "ROAD_TYPE" : [ROADS]
      let reducedPathsObj = {};

      // get values for roadPaths, boundary center and reducedPaths
      shapeGeoJson.features.map((feature, index) => {
        const coordinates = feature.geometry.coordinates;
        roadsPaths.push({
          coordinates: feature.geometry.coordinates,
          properties: { ID: index, ...feature.properties },
        });
        if (index === Math.floor(shapeGeoJson.features.length / 2)) {
          view.center = [-79.8161225, 43.2473732];
        }
      });

      reducedPathsObj = getReducedPaths(roadsPaths, "ROAD_TYPE");

      // key-value pair object as
      // roadType: paths
      const roadsGraphicsObj = getGraphicObj(
        reducedPathsObj,
        Graphic,
        roadGraphicOptions
      );

      // get fields titles for table
      const fieldTitleKeys = getFieldTitles(roadsPaths[0].properties);
      // get values type for fields
      const fieldTitleValues = getFieldValue(fieldTitleKeys);

      const roadLayerPopupTemplate = {
        // autocasts as new PopupTemplate()
        title:
          "<img src='https://irisradgroup.maps.arcgis.com/sharing/rest/content/items/1402078d37094752a3632510e7006123/data' style='width: 25px; margin-bottom: -5px'>  <span style='font-size: 1.25rem'>Places in Los Angeles</span>",
        content: [
          // first column
          {
            type: "fields",
            fieldInfos: fieldTitleKeys,
          },
        ],
        // actions: [createWorkOrder, resolve],
      };

      // contains all road type feature layers
      const roadLayers = [];

      // get a feature layer for each road type
      for (const roadType in roadsGraphicsObj) {
        if (roadsGraphicsObj.hasOwnProperty(roadType)) {
          const pathsGraphics = roadsGraphicsObj[roadType];
          // generate feature layer by given road type
          const roadTypeFeatureLayer = new FeatureLayer({
            title: roadType,
            id: roadType,
            source: pathsGraphics,

            renderer: getRoadFeatureLayerRenderer(roadType),
            popupTemplate: roadLayerPopupTemplate,
            objectIdField: "ObjectID", // This must be defined when creating a layer from `Graphic` objects
            fields: fieldTitleValues,
          });

          roadLayers.push(roadTypeFeatureLayer);
        }
      }

      // a group layer contains all the road type
      // feature layers
      const roadTypesGroupLayer = new GroupLayer({
        id: LAYER_TYPES.ROAD_LAYER,
        title: LAYER_TYPES.ROAD_LAYER,
        layers: roadLayers,
      });

      // the root group layer that contains various
      // sub group layers
      const dataPointGroupLayer = getDataPointGroupLayer(
        LAYER_TYPES.DATA_POINT_LAYER,
        dataGroupType,
        Graphic,
        FeatureLayer,
        GroupLayer
      );
      allLayers.push(roadTypesGroupLayer);
      allLayers.push(dataPointGroupLayer);

      // generate layer list that shows basic info, layer's name,
      // each layer's legend names and associated legend colors
      // and icon for toggling visibility of each layer
      const roadTypesLayerList = new LayerList({
        view: view,
        listItemCreatedFunction: panelFunction,
        // listItemCreatedFunction: function (event) {
        //   const item = event.item;
        //   item.open = true;
        //   // displays the legend for each layer list item
        //   item.panel = {
        //     content: ["legend"],
        //   };
        // },
      });

      // put layer list on top-left corner on the map view
      view.ui.add(roadTypesLayerList, "top-left");

      // add custom actionable buttons on each popup
      view.popup.on("trigger-action", function (event) {
        // Execute the measureThis() function if the measure-this action is clicked
        if (event.action.id === "create-work-order") {
          const id = getDataIdFromPopup(view.popup);
          // console.log("create-work-order should be executed");
        }
      });

      // add or remove layers from map view based on
      // selected layers
      toggleFeatureLayers(map, allLayers, selectedLayers);

      setAllGroupLayers(allLayers);
      return () => {
        if (view) {
          view.container = null;
        }
        if (mapView) {
          mapView.container = null;
        }
      };
    });
  }, []);

  const toggleFeatureLayers = (
    mapObject,
    allAvailableLayers,
    selectedLayerIds
  ) => {
    if (
      !isValidObj(mapObject) ||
      !isValidObj(allAvailableLayers) ||
      !isValidObj(selectedLayerIds)
    ) {
      return;
    }
    if (mapObject) {
      debugger;
      const layersInMap = mapObject.layers.items;
      const selectedLayers = allAvailableLayers.filter((availableLayer) => {
        for (const selectedLayerId of selectedLayerIds) {
          if (selectedLayerId === availableLayer.id) {
            return availableLayer;
          }
        }
      });
      if (selectedLayers.length === 0) {
        mapObject.removeAll();
      } else if (layersInMap.length === 0) {
        mapObject.addMany(selectedLayers);
      } else {
        const layersToBeRemoved = leftJoin(layersInMap, selectedLayers);
        const layersToBeAdded = leftJoin(selectedLayers, layersInMap);

        // if (layersToBeAdded.length !== 0) {
        //   const a = layersToBeAdded[0];
        //   const fe = a.layers.items[0].fullExtent;
        //   // mapView.fullExtent = fe;
        //   mapView.goTo(fe);
        // }

        console.log("all layer ids");
        layersInMap.map((l) => console.log(l.id));
        console.log("selected layer ids");
        selectedLayers.map((l) => console.log(l.id));
        console.log("ids to be removed");
        layersToBeRemoved.map((l) => console.log(l.id));
        console.log("ids to be added");
        layersToBeAdded.map((l) => console.log(l.id));

        mapObject.removeMany(layersToBeRemoved);
        mapObject.addMany(layersToBeAdded);
      }
    }
  };

  useEffect(() => {
    toggleFeatureLayers(map, allGroupLayers, selectedLayers);
  }, [selectedLayers]);

  useEffect(() => {
    if (map && selectedData && zoomToSelectedData) {
      mapView.center = [selectedData.longitude, selectedData.latitude];
      mapView.zoom = 18;
      // mapView.goTo({
      //   center:[location.longitude, location.latitude],
      // })
      setZoomToSelectedData(false);
    }
  }, [zoomToSelectedData]);
  useEffect(() => {
    if (map) {
      loadModules(
        ["esri/Graphic", "esri/layers/FeatureLayer", "esri/layers/GroupLayer"],
        {
          css: true,
        }
      ).then(async ([Graphic, FeatureLayer, GroupLayer]) => {
        const updatedDataPointGroupLayer = getDataPointGroupLayer(
          LAYER_TYPES.DATA_POINT_LAYER,
          dataGroupType,
          Graphic,
          FeatureLayer,
          GroupLayer
        );

        const currentDataPointLayer = map.layers.items.find(
          (layer) => layer.id === updatedDataPointGroupLayer.id
        );
        if (currentDataPointLayer) {
          map.remove(currentDataPointLayer);
        }
        map.add(updatedDataPointGroupLayer);
      });
    }
  }, [dataGroupType]);

  useEffect(() => {
    if (map) {
      map.basemap = mapType;
    }
  }, [mapType]);

  useEffect(() => {
    toggleSublayers(layerFilterTypes);
  }, [layerFilterTypes]);
  function getDataIdFromPopup(popup) {
    const id = popup.content.graphic.attributes.id || -1;

    const currentDataPoint = dataPointJson.find((data) => data.id === id);
    console.log("matchedData", currentDataPoint);
    setSelectedData(currentDataPoint);
    setOpenPanel(true);
    setSelectedPanelIndex(1);
  }

  function toggleSublayers(selectedLayers) {
    // get the filtered out layer ids
    const hiddenSublayersIds = leftJoin(
      Object.keys(LAYER_FILTER_TYPES),
      selectedLayers
    );

    // found data points layer
    const dataPointGroupLayer = allGroupLayers.find(
      (layer) => layer.id === LAYER_TYPES.DATA_POINT_LAYER
    );

    // toggle visibile of each sub layer
    if (dataPointGroupLayer) {
      for (const firstSublayer of dataPointGroupLayer.layers.items) {
        for (const secondSublayer of firstSublayer.layers.items) {
          const shouldBeHidden =
            hiddenSublayersIds.indexOf(secondSublayer.id) > -1;
          secondSublayer.visible = !shouldBeHidden;
        }
      }
    }
  }
  return <div className="webmap" style={{ height: "93vh" }} ref={mapRef} />;
};
