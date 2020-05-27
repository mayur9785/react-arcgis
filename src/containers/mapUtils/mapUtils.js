import { loadModules } from "esri-loader";
import { styleFont } from "./mapStyleUtils";
import {
  isValidObj,
  isDateValid,
} from "../../utils/utilFunctions/utilFunctions";
import {
  GEOMETRY_TYPE,
  DATA_POINT_FILTER_TYPES,
  DATA_POINT_MARKER_SYMBOLS,
  PCI_VALUES,
  DEFAULT_SYMBOL_SIZE,
  DEFAULT_MARKER_WIDTH,
  DEFAULT_MARKER_ALPHA,
} from "../../constants/mapConstants";

const shp = require("shpjs");

export const LAYER_TYPES = {
  ROAD_LAYER: "Road Layer",
  BOUNDARY_LAYER: "Boundary Layer",
  DATA_POINT_LAYER: "Data Point Layer",
};

export async function getBoundaryAndCenter(zipFilePath) {
  return new Promise(async (resolve, reject) => {
    const boundaryPaths = [];
    let boundaryCenter;
    const geojsons = await shp(zipFilePath).catch((error) => {
      reject(error);
    });
    if (geojsons) {
      console.log("all geojsons", geojsons);
      geojsons.features.map((feature, index) => {
        const coordinates = feature.geometry.coordinates;
        boundaryPaths.push({
          coordinates: feature.geometry.coordinates,
          properties: { ID: index, ...feature.properties },
        });
        if (index === Math.floor(geojsons.features.length / 2)) {
          boundaryCenter = coordinates[0];
        }
      });
      resolve({ boundaryPaths, boundaryCenter });
    }
  });
}

// topo
// streets
// satellite
// hybrid

// dark-gray
// gray
// national-geographic
// oceans
// osm
// terrain
// dark-gray-vector
// gray-vector
// streets-vector
// streets-night-vector
// streets-navigation-vector
// topo-vector
// streets-relief-vector

export async function getBaseMap(mapTypeString = "topo") {
  let mapInstance;
  const arcgisModules = await loadModules(["esri/Map"]).catch((error) => {
    console.log("error in getting map instance", error);
  });
  if (arcgisModules && arcgisModules[0]) {
    mapInstance = new arcgisModules[0]({
      basemap: mapTypeString,
    });
  }
  return mapInstance;
}

export async function getMapView(
  mapInstance,
  center = [-118.805, 34.027],
  domReference
) {
  let mapViewInstance;
  const arcgisModules = await loadModules(["esri/views/MapView"]).catch(
    (error) => {
      console.log("error in getting map instance", error);
    }
  );
  if (arcgisModules && arcgisModules[0]) {
    mapViewInstance = new arcgisModules[0]({
      container: domReference,
      map: mapInstance,
      center: center,
      zoom: 13,
    });
  }
  return mapViewInstance;
}

export function getFieldInfo(fieldTitle, fontStyleTag = "h3") {
  let info = {
    fieldName: fieldTitle,
    label: fontStyleTag ? styleFont(fieldTitle, fontStyleTag) : fieldTitle,
    visible: true,
  };
  return info;
}

export function getReducedPaths(pathsArray, keyToBeReduced) {
  const reducedPaths = pathsArray.reduce((acc, element) => {
    const key = element.properties[keyToBeReduced];
    const value = acc[key] || [];
    value.push(element);
    return { ...acc, [key]: value };
  }, {});

  return reducedPaths;
}

function getTableKeyValue(property) {
  const copiedProperty = { ...property };
  for (const key in copiedProperty) {
    if (copiedProperty.hasOwnProperty(key)) {
      let element = copiedProperty[key];
      if (!isNaN(element) && element !== "") {
        const twoDecimalString = Number(element).toFixed(2);
        element = parseFloat(twoDecimalString).toLocaleString("en");
      }
      copiedProperty[key] = styleFont(element, "h3");
    }
  }
  return copiedProperty;
}

// get graphic from data
export function getGraphic(data, GraphicsClass, graphicsOptions) {
  if (!isValidObj(GraphicsClass)) {
    return null;
  }

  const { graphicType, symbol } = graphicsOptions;
  const arcgisGraphic = data.map((d) => {
    const geometryObject = getGeometryObject(d, graphicType);
    return new GraphicsClass({
      attributes: getTableKeyValue(d.properties),
      geometry: geometryObject,
      symbol: symbol,
    });
  });
  return arcgisGraphic;
}

function getGeometryObject(data, gemoetryType) {
  let geometryObject = {};
  if (!isValidObj(data) || !isValidObj(gemoetryType)) {
    return geometryObject;
  }
  geometryObject = { type: gemoetryType };
  switch (gemoetryType) {
    case GEOMETRY_TYPE.POINT:
      geometryObject = {
        ...geometryObject,
        longitude: Number(data.longitude),
        latitude: Number(data.latitude),
      };
      break;
    case GEOMETRY_TYPE.POLY_LINE:
      geometryObject = { ...geometryObject, paths: data.coordinates };
      break;
    case GEOMETRY_TYPE.POLYGON:
      geometryObject = { ...geometryObject, rings: data.coordinates };
      break;
  }
  return geometryObject;
}

// convert pathsObject
// from key: paths
// to   key: graphics
export function getGraphicObj(pathsObject, GraphicsClass, graphicOptions) {
  const graphicsObject = {};
  if (!isValidObj(GraphicsClass)) {
    return graphicsObject;
  }
  const { graphicType, graphicSymbol } = graphicOptions;
  for (const roadTypeKey in pathsObject) {
    if (pathsObject.hasOwnProperty(roadTypeKey)) {
      const paths = pathsObject[roadTypeKey];
      // const geometryObject = getGeometryObject(paths, graphicType);

      const pathsGraphics = getGraphic(paths, GraphicsClass, {
        graphicType: graphicType,
        symbol: graphicSymbol,
      });
      graphicsObject[roadTypeKey] = pathsGraphics;
    }
  }
  return graphicsObject;
}

export function getLayer(
  LayerClass,
  graphicData,
  stringForTitleAndId,
  layerRenderer,
  layerPopupTemplate,
  fieldsValue
) {
  if (!isValidObj(LayerClass) || !isValidObj(graphicData)) {
    return null;
  }
  return new LayerClass({
    title: stringForTitleAndId,
    id: stringForTitleAndId,
    source: graphicData,
    renderer: layerRenderer,
    popupTemplate: layerPopupTemplate,
    objectIdField: "ObjectId",
    fields: fieldsValue,
  });
}

const getMonthShortName = (date) => {
  let shortName = "unknown mont short name";
  if (isDateValid(date)) {
    const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
      .format;
    shortName = shortMonthName(date);
  }
  return shortName;
};

function getDateValue(dateString, valueType) {
  const currentDate = new Date(dateString);
  if (isDateValid(currentDate)) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    const monthString = getMonthShortName(currentDate);
    switch (valueType) {
      case DATA_POINT_FILTER_TYPES.YEAR:
        return year;
      case DATA_POINT_FILTER_TYPES.MONTH:
        return `${monthString}, ${year}`;
      default:
        return `${monthString} ${date}, ${year}`;
    }
  }
}
export function reduceDataByCategory(data, category, dateType) {
  let rd = {};
  // reduced data by date value
  if (dateType) {
    rd = data.reduce((categoriedData, element) => {
      const fieldValue = element[category];
      let newKey = getDateValue(fieldValue, dateType);
      const recentData = categoriedData[newKey] || [];
      recentData.push(element);
      return { ...categoriedData, [newKey]: recentData };
    }, {});
  } else {
    rd = data.reduce((categoriedData, element) => {
      const fieldValue = element[category];
      let newKey = fieldValue;
      if (fieldValue === "null") {
        newKey = "N / A";
      }
      const recentData = categoriedData[newKey] || [];
      recentData.push(element);
      return { ...categoriedData, [newKey]: recentData };
    }, {});
  }
  return rd;
}

export function isLayerExisted(mapObject, layerId) {
  let isLayerExist = false;
  for (const layer of mapObject.layers.items) {
    if (layer.id === layerId) {
      isLayerExist = true;
    }
  }
  return isLayerExist;
}

// random color for paths
// since have no idea how many of them
// would be

export function getRandomRGB(alpha) {
  const randomArcgisColor = [];
  const r = Math.ceil(255 * Math.random());
  for (let i = 0; i < 3; i++) {
    randomArcgisColor.push(Math.ceil(255 * Math.random()));
  }
  if (isValidObj(alpha) && !isNaN(alpha)) {
    randomArcgisColor.push(alpha);
  }
  return randomArcgisColor;
}

export function getRandomSimpleMarkerSymbol(symbolSiz, alpha, width) {
  return {
    size: symbolSiz,
    type: "simple-marker",
    color: getRandomRGB(alpha),
    width: width,
  };
}

// get simple marker symbol, color, based
// on filter type, IE: PCI
export function getSimpleMarkerSymbol(filterType) {
  debugger;
  if (isValidObj(filterType)) {
    switch (filterType.toLowerCase()) {
      case PCI_VALUES.GOOD:
        return DATA_POINT_MARKER_SYMBOLS.DEFAULT;
      case PCI_VALUES.FAIR:
        return DATA_POINT_MARKER_SYMBOLS.SECONDARY;
      case PCI_VALUES.POOR:
        return DATA_POINT_MARKER_SYMBOLS.WARNNING;
      case PCI_VALUES.VERY_POOR: {
        return DATA_POINT_MARKER_SYMBOLS.PRIMARY;
      }
      default:
        return getRandomSimpleMarkerSymbol(
          DEFAULT_SYMBOL_SIZE,
          DEFAULT_MARKER_ALPHA,
          DEFAULT_MARKER_WIDTH
        );
    }
  }
}
