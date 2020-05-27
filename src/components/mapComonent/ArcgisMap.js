import React, { useEffect, useRef, useState, useContext } from "react";
import { loadModules } from "esri-loader";
import shapeGeoJson from "../mapComonent/hamiltonDataFilterDemo/Muskoka_Road_Network.json";
import dataPointJson from "../mapComonent/hamiltonDataFilterDemo/data.json";

import {
  DATA_POINT_FILTER_TYPES,
  DATA_POINT_MARKER_SYMBOLS,
} from "../../constants/mapConstants";
import {
  getBaseMap,
  getMapView,
  getFieldInfo,
  getReducedPaths,
  getGraphic,
  getGraphicObj,
  reduceDataByCategory,
  LAYER_TYPES,
  getRandomRGB,
  getSimpleMarkerSymbol,
} from "../../containers/mapUtils/mapUtils.js";
import { isValidObj } from "../../utils/utilFunctions/utilFunctions";
import { MapContext } from "../../context/mapContext";

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

  if (item.title === "Roads Layer") {
    // An array of objects defining actions to place in the LayerList.
    // By making this array two-dimensional, you can separate similar
    // actions into separate groups with a breaking line.

    item.actionsSections = [
      [
        {
          title: "Go to full extent",
          className: "esri-icon-zoom-out-fixed",
          id: "full-extent",
        },
        {
          title: "Layer information",
          className: "esri-icon-description",
          id: "information",
        },
      ],
      [
        {
          title: "Increase opacity",
          className: "esri-icon-up",
          id: "increase-opacity",
        },
        {
          title: "Decrease opacity",
          className: "esri-icon-down",
          id: "decrease-opacity",
        },
      ],
    ];
  }
};

const createWorkOrder = {
  title: "create work order",
  id: "create-work-order",
};

const resolve = {
  title: "Resolved",
  id: "measure-this",
};

export const ArcgisMap = (props) => {
  const { values, setters } = useContext(MapContext);
  const {
    mapType,
    dataFilterType,
    selectedData,
    selectedDate,
    selectedLayers,
    zoomToSelectedData,
  } = values;
  const {
    setMapType,
    setDataFilterType,
    setSelectedData,
    setSelectedDate,
    setSelectedLayers,
    setZoomToSelectedData,
  } = setters;

  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [mapView, setMapView] = useState(null);

  const [allGroupLayers, setAllGroupLayers] = useState([]);

  function getDataPointGroupLayer(
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

    let groupedDataPoints = {};
    if (DATA_POINT_FILTER_TYPES.PCI === filterType) {
      groupedDataPoints = reduceDataByCategory(
        dataPointJson,
        "pci",
        filterType
      );
    } else {
      groupedDataPoints = reduceDataByCategory(
        dataPointJson,
        "create_time",
        filterType
      );
    }

    const dataPointGraphicsObj = getGraphicObj(
      groupedDataPoints,
      GraphicClass,
      {
        graphicType: "point",
      }
    );

    const dataPointLayers = [];
    for (const dataPointTitle in dataPointGraphicsObj) {
      if (dataPointGraphicsObj.hasOwnProperty(dataPointTitle)) {
        const pathsGraphics = dataPointGraphicsObj[dataPointTitle];
        // generate feature layer by given road type
        const markerSymbol = getSimpleMarkerSymbol(dataPointTitle);
        debugger;
        const roadTypeFeatureLayer = new FeatureLayerClass({
          title: dataPointTitle,
          source: pathsGraphics,
          renderer: {
            type: "simple",
            // symbol: {
            //   size: "12px",
            //   type: "simple-marker",
            //   color: [0, 83, 183, 255],
            //   width: 1,
            // },
            symbol: markerSymbol,
            label: dataPointTitle,
          },
          // title: roadType,

          // renderer: {
          //   type: "simple",
          //   symbol: {
          //     type: "simple-marker",
          //     color: [165, 83, 183, 255],
          //     width: 1,
          //   },
          // },
          // transparency: 0,
          // labelingInfo: null,
          // source: pathsGraphics,

          // renderer: getRoadFeatureLayerRenderer(roadType),
          // popupTemplate: roadLayerPopupTemplate,
          objectIdField: "dataPointObjectID", // This must be defined when creating a layer from `Graphic` objects
          // fields: fieldTitleValues,
        });

        dataPointLayers.push(roadTypeFeatureLayer);
      }
    }

    const dataPointGroupLayer = new GroupLayerClass({
      id: LAYER_TYPES.DATA_POINT_LAYER,
      title: LAYER_TYPES.DATA_POINT_LAYER,
      layers: dataPointLayers,
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
          view.center = coordinates[0];
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
        actions: [createWorkOrder, resolve],
      };

      // contains all road type feature layers
      const layers = [];

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

          layers.push(roadTypeFeatureLayer);
        }
      }

      // a group layer contains all the road type
      // feature layers
      const roadTypesGroupLayer = new GroupLayer({
        id: LAYER_TYPES.ROAD_LAYER,
        title: LAYER_TYPES.ROAD_LAYER,
        layers: layers,
      });

      const dataPointGroupLayer = getDataPointGroupLayer(
        dataFilterType,
        Graphic,
        FeatureLayer,
        GroupLayer
      );

      // assign raod type group layer
      // setRoadGroupLayer(roadTypesGroupLayer);
      allLayers.push(roadTypesGroupLayer);
      allLayers.push(dataPointGroupLayer);
      // layer list for road types

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
      view.ui.add(roadTypesLayerList, "top-left");

      // set up popup listener
      view.popup.on("trigger-action", function (event) {
        // Execute the measureThis() function if the measure-this action is clicked
        if (event.action.id === "create-work-order") {
          const id = getDataIdFromPopup(view.popup, "ID");
          alert(`creating work order for road #: ${id}`);
          // console.log("create-work-order should be executed");
        }
      });

      toggleFeatureLayers(map, allLayers, selectedLayers);
      // updating map ui animation
      // view.watch("updating", function (evt) {
      //   debugger;

      //   if (evt) {
      //     if (isHeavingLoading) {
      //       props.setLoading(isHeavingLoading);
      //       setIsHeavingLoading(false);
      //     }
      //   } else if (!evt && isHeavingLoading) {
      //     props.setLoading(false);
      //     setIsHeavingLoading(false);
      //   }
      // });

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
        const layersToBeRemoved = layersInMap.filter((existedLayer) => {
          for (const selectedLayer of selectedLayers) {
            if (existedLayer.id !== selectedLayer.id) {
              return existedLayer;
            }
          }
        });

        const layersToBeAdded = selectedLayers.filter((selectedLayer) => {
          for (const existedLayer of layersInMap) {
            if (selectedLayer.id !== existedLayer) {
              return selectedLayer;
            }
          }
        });

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
          dataFilterType,
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
  }, [dataFilterType]);

  useEffect(() => {
    if (map) {
      map.basemap = mapType;
    }
  }, [mapType]);

  return <div className="webmap" style={{ height: "93vh" }} ref={mapRef} />;
};

function isEqual() {
  return true;
}
function getDataIdFromPopup(popup, attributeKey) {
  let id = -1;
  const idHTMLValue = popup.content.graphic.attributes[attributeKey];
  if (idHTMLValue) {
    const startIndex = idHTMLValue.indexOf(">");
    const endIndex = idHTMLValue.lastIndexOf("<");
    const tempString = idHTMLValue.substring(startIndex + 1, endIndex);
    const numberString = tempString.split(",").join("");
    id = isNaN(Number(numberString)) ? -1 : Number(numberString);
  }

  return id;
}
