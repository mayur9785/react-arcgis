import { loadModules } from "esri-loader";
import { styleFont } from "./mapStyleUtils";
import {
  isValidObj,
  isDateValid,
  isEmptyObject,
} from "../../utils/utilFunctions/utilFunctions";
import {
  GEOMETRY_TYPES,
  DATA_POINT_GROUP_TYPES,
  DATA_POINT_MARKER_SYMBOLS,
  PCI_VALUES,
  DEFAULT_SYMBOL_SIZE,
  DEFAULT_MARKER_WIDTH,
  DEFAULT_MARKER_ALPHA,
  LAYER_FILTER_TYPES,
} from "../../constants/mapConstants";

const shp = require("shpjs");

/**
 * feature layers
 */
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

/**
 *get base map instance
 *
 * @param {String} mapTypeString Arcgis map type string
 */
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

/**
 *
 * @param {Map} mapInstance Arcgis Map instancwe
 * @param {[Number, Number]} center map view's center
 * @param {ReactReference} domReference react ref where would hold the map view element
 */
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

/**
 * get field info, value, for given
 * field title
 * @see styleFont
 *
 * @param {String} fieldTitle
 * @param {String} fontStyleTag
 */
export function getFieldInfo(fieldTitle, fontStyleTag = "h3") {
  let info = {
    fieldName: fieldTitle,
    label: fontStyleTag ? styleFont(fieldTitle, fontStyleTag) : fieldTitle,
    visible: true,
  };
  return info;
}

/**
 * reduce array of paths based on given key's value in to form
 * of
 * {
 *  value0ForKeyTobeReduced0: [corresponding paths],
 *  value1ForKeyTobeReduced0: [corresponding paths],
 *  value2ForKeyTobeReduced0: [corresponding paths],
 *  value3ForKeyTobeReduced0: [corresponding paths],
 * }
 *
 * @param {Array} pathsArray
 * @param {String} keyToBeReduced
 */
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

/**
 * get path graphics that contains the values
 * to be display on the pop up
 *
 * @see getGeometryObject
 * @see getTableKeyValue
 *
 * @param {Array} data
 * @param {Graphic} GraphicsClass
 * @param {Object} graphicsOptions
 */
export function getPathGraphic(data, GraphicsClass, graphicsOptions) {
  if (!isValidObj(GraphicsClass)) {
    return null;
  }

  const { graphicType, symbol } = graphicsOptions;
  const arcgisGraphic = data.map((d) => {
    const geometryObject = getGeometryObject(d, graphicType);
    return new GraphicsClass({
      attributes: getTableKeyValue(d.properties), // corresponding values to be display
      geometry: geometryObject,
      symbol: symbol,
    });
  });
  return arcgisGraphic;
}

/**
 * conver data points into array of graphic objects
 * that would be used to construct feature layers
 *
 * ie featureLayer = new FeatureLayers({
 *  source: [graphic]
 * })
 *
 * @see getGeometryObject
 *
 * @param {Object} data
 * @param {Graphic} GraphicsClass
 * @param {Object} graphicsOptions
 */
export function getDataPointGraphic(data, GraphicsClass, graphicsOptions) {
  if (!isValidObj(GraphicsClass)) {
    return null;
  }

  const { graphicType, symbol } = graphicsOptions;
  let arcgisGraphic = {};

  if (Array.isArray(data)) {
    arcgisGraphic = data.map((d, index) => {
      const geometryObject = getGeometryObject(d, graphicType);
      const updatedData = { ...d };
      for (const key in updatedData) {
        if (updatedData.hasOwnProperty(key)) {
          const element = updatedData[key];
          if (element === "null") {
            updatedData[key] = "N / A";
          }
        }
      }
      return new GraphicsClass({
        attributes: updatedData,
        geometry: geometryObject,
        symbol: symbol,
      });
    });
  } else {
    Object.keys(data).map((keyType) => {
      // if (
      //   keyType === DATA_POINT_FILTER_TYPES["No Issues"].name ||
      //   keyType === DATA_POINT_FILTER_TYPES["red flag"].name ||
      //   keyType === DATA_POINT_FILTER_TYPES["yellow flag"].name
      // ) {
      arcgisGraphic = data[keyType].map((d, index) => {
        const geometryObject = getGeometryObject(d, graphicType);
        const updatedData = { ...d };
        for (const key in updatedData) {
          if (updatedData.hasOwnProperty(key)) {
            const element = updatedData[key];
            if (element === "null") {
              updatedData[key] = "N / A";
            }
          }
        }
        return new GraphicsClass({
          attributes: updatedData,
          geometry: geometryObject,
          symbol: symbol,
        });
      });
      // }
    });
  }

  return arcgisGraphic;
}

/**
 * get geometry object for given data, based on given
 * geometryType, ie: point/ polyline/ polygon, which would
 * be used as geometry to construct a graphic object
 *
 * ie
 *
 * graphic = new Graphic({
 *  geometry: newGeometry
 * })
 *
 * @param {Object} data
 * @param {String} gemoetryType
 */
function getGeometryObject(data, gemoetryType) {
  let geometryObject = {};
  if (!isValidObj(data) || !isValidObj(gemoetryType)) {
    return geometryObject;
  }
  geometryObject = { type: gemoetryType };
  switch (gemoetryType) {
    case GEOMETRY_TYPES.POINT:
      geometryObject = {
        ...geometryObject,
        longitude: Number(data.longitude),
        latitude: Number(data.latitude),
      };
      break;
    case GEOMETRY_TYPES.POLY_LINE:
      geometryObject = { ...geometryObject, paths: data.coordinates };
      break;
    case GEOMETRY_TYPES.POLYGON:
      geometryObject = { ...geometryObject, rings: data.coordinates };
      break;
  }
  return geometryObject;
}

/**
 * convert pathsObject from
 * {
 *  key0: [paths]
 *  key1: [paths]
 * }
 *
 * to
 *
 * {
 *  key0: [graphics]
 *  key1: [graphics]
 * }
 * @see getDataPointGraphic
 * @see getPathGraphic
 *
 * @param {Object} pathsObject
 * @param {Object} GraphicsClass
 * @param {Object} graphicOptions
 */
export function getGraphicObj(pathsObject, GraphicsClass, graphicOptions) {
  const graphicsObject = {};
  if (!isValidObj(GraphicsClass)) {
    return graphicsObject;
  }
  const { graphicType, graphicSymbol } = graphicOptions;
  for (const roadTypeKey in pathsObject) {
    if (pathsObject.hasOwnProperty(roadTypeKey)) {
      const paths = pathsObject[roadTypeKey];
      let targetGraphics;
      if (graphicType === "point") {
        targetGraphics = getDataPointGraphic(paths, GraphicsClass, {
          graphicType: graphicType,
          symbol: graphicSymbol,
        });
      } else {
        targetGraphics = getPathGraphic(paths, GraphicsClass, {
          graphicType: graphicType,
          symbol: graphicSymbol,
        });
      }
      graphicsObject[roadTypeKey] = targetGraphics;
    }
  }
  return graphicsObject;
}

/**
 * get month's string value from given
 * date string
 * ie from 01/01/2020
 *    to   Jan 01, 2020
 *
 * @param {String} dateString
 */
function getMonthShortName(dateString) {
  let shortName = "unknown mont short name";
  if (isDateValid(dateString)) {
    const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
      .format;
    shortName = shortMonthName(dateString);
  }
  return shortName;
}

/**
 * convert database date string to
 * more readable data string
 * ie from 01/01/2020 to Jan 01, 2020
 *    from 01/2020    to Jan 2020
 *
 * @see getMonthShortName
 *
 * @param {String} dateString
 * @param {String} valueType in one of the following: "date", "month" or "year"
 */
function getDateValue(dateString, valueType) {
  const currentDate = new Date(dateString);
  if (isDateValid(currentDate)) {
    const year = currentDate.getFullYear();
    // const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    const monthString = getMonthShortName(currentDate);
    switch (valueType) {
      case DATA_POINT_GROUP_TYPES.YEAR:
        return year;
      case DATA_POINT_GROUP_TYPES.MONTH:
        return `${monthString}, ${year}`;
      default:
        return `${monthString} ${date}, ${year}`;
    }
  }
}

/**
 * groupd array of data point based on either "date", "month", "year", or "pci" groupType
 * ie
 * based on pci
 * {
 *  "Good": [dataPoints]
 *  "fair": [dataPoints],
 * }
 *
 * based on month
 * {
 *  Jan 2020: [dataPoints],
 *  Feb 2020: [dataPoints]
 * }
 * etc
 * @see getDateValue
 *
 * @param {Array} data
 * @param {String} groupType in one of the following "pci", "date", "month", "year"
 */
export function getGroupedData(data, groupType) {
  let rd = {};
  // PCI grouping
  if (groupType === DATA_POINT_GROUP_TYPES.PCI) {
    rd = data.reduce((categoriedData, element) => {
      const newKey = element["pci"];
      // let newKey = getDateValue(fieldValue, groupType);
      const recentData = categoriedData[newKey] || [];
      recentData.push(element);
      return { ...categoriedData, [newKey]: recentData };
    }, {});
  }
  // date type grouping
  else {
    rd = data.reduce((categoriedData, element) => {
      const fieldValue = element["create_time"];
      let newKey = getDateValue(fieldValue, groupType);
      const recentData = categoriedData[newKey] || [];
      recentData.push(element);
      return { ...categoriedData, [newKey]: recentData };
    }, {});
  }
  return rd;
}

/**
 * determine whehter map object contains
 * a layer whose id matches given layer id
 *
 * @param {Object} mapObject
 * @param {String} layerId
 */
export function isLayerExisted(mapObject, layerId) {
  let isLayerExist = false;
  for (const layer of mapObject.layers.items) {
    if (layer.id === layerId) {
      isLayerExist = true;
    }
  }
  return isLayerExist;
}

/**
 * generate random rgb for feature layer render's symbol
 * ie
 * featureLayer = new FeatureLayer({
 *  ...,
 *  symbol: {
 *    color: getRandomRGB(alpha)
 *  }
 * })
 *
 * @param {Number} alpha
 */
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

/**
 * get randome simple marker symbol for a
 * feature layer
 *
 * ie
 *
 * featureLayer = new Feature({
 *  symbol: getRandomSimpleMarkerSymbol(number0, number1, number2)
 * })
 *
 * @see getRandomRGB
 *
 * @param {Number} symbolSize
 * @param {Number} alpha
 * @param {Number} width
 */
export function getRandomSimpleMarkerSymbol(symbolSize, alpha, width) {
  return {
    size: symbolSize,
    type: "simple-marker",
    color: getRandomRGB(alpha),
    width: width,
  };
}

/**
 * get DEFAULT simple marker symbol, color, based
 * on filter type, IE: PCI
 *
 * @see getRandomSimpleMarkerSymbol
 *
 * @param {String} filterType
 */
export function getSimpleMarkerSymbol(filterType) {
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

/**
 * get a render for rendering icon symbol on a
 * feature layer
 *
 * ie
 *
 * featureLayer = new FeatureLayer({
 *  renderer: getIconRenderer(pathString, iconTitleString, iconSize)
 * })
 *
 * @param {String} inconPath
 * @param {String} iconTitle used to be display as legend title for given renderer
 * @param {Number} iconSize
 */
export function getIconRenderer(inconPath, iconTitle, iconSize) {
  const iconRender = {
    type: "simple",
    symbol: {
      type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
      url: inconPath,
      width: `${iconSize}px`,
      height: `${iconSize}px`,
    },
    label: iconTitle,
  };
  return iconRender;
}

/**
 * convert dataPonts, from [dataPoints0, dataPoints1, ...]
 * to
 * {
 *   filterTypeKey0 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
 *   filterTypeKey1 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
 *   filterTypeKey2 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
 *   filterTypeKey3 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
 * }
 * based on filter type, ie: date, month, year, and pci
 *
 * @see getGroupedData
 * @see getFilteredData
 *
 * @param {String} filterType
 * @param {Array} data
 */
export function getGroupedDataPoints(groupType, data) {
  const groupedDataPoints = getGroupedData(data, groupType);
  debugger;
  const updatedGroupLayer = {};
  for (const key in groupedDataPoints) {
    updatedGroupLayer[key] = {};
    if (groupedDataPoints.hasOwnProperty(key)) {
      const element = groupedDataPoints[key];
      Object.keys(LAYER_FILTER_TYPES).map((filterType) => {
        const r = getFilteredData(element, filterType);
        if (isEmptyObject(r) || r.length === 0) {
          return;
        }
        updatedGroupLayer[key][filterType] = r;
      });
    }
  }
  return updatedGroupLayer;
}

/**
 * 
 * convert data points from

 * {
 *   filterTypeKey0 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
 *   filterTypeKey1 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
 *   filterTypeKey2 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
 *   filterTypeKey3 : { no issues: [dataPoints], rri: [dataPoints] mms: [dataPoints] red flag: [dataPoints] yellow falg: [dataPoints] },
 * }

 * to graphic objects

 * {
 *   filterTypeKey0 : { no issues: [graphicObjects], rri: [graphicObjects] mms: [graphicObjects] red flag: [graphicObjects] yellow falg: [graphicObjects] },
 *   filterTypeKey1 : { no issues: [graphicObjects], rri: [graphicObjects] mms: [graphicObjects] red flag: [graphicObjects] yellow falg: [graphicObjects] },
 *   filterTypeKey2 : { no issues: [graphicObjects], rri: [graphicObjects] mms: [graphicObjects] red flag: [graphicObjects] yellow falg: [graphicObjects] },
 *   filterTypeKey3 : { no issues: [graphicObjects], rri: [graphicObjects] mms: [graphicObjects] red flag: [graphicObjects] yellow falg: [graphicObjects] },
 * }
 * 
 * so that each [graphicObjects] could be use to geneate a faature layer
 * 
 * ie
 * 
 * featureLayer = new FeatureLayer({
 *  source: [graphicObjects]
 * })
 * 
 * @see getGraphicObj
 * 
 * @param {Object} groupedDataPoints 
 * @param {Object} GraphicClass 
 */
export function getGroupedDataPointsGraphics(groupedDataPoints, GraphicClass) {
  const groupdedDataPointsGraphics = {};
  if (!isValidObj(groupedDataPoints && !isValidObj(GraphicClass))) {
    return groupdedDataPointsGraphics;
  }
  for (const key in groupedDataPoints) {
    if (groupedDataPoints.hasOwnProperty(key)) {
      const element = groupedDataPoints[key];
      Object.keys(element).map((subKey) => {
        const obj = { [subKey]: element[subKey] };
        const dataPointGraphicsObj = getGraphicObj(obj, GraphicClass, {
          graphicType: "point",
        });
        if (!groupdedDataPointsGraphics[key]) {
          groupdedDataPointsGraphics[key] = {};
        }

        groupdedDataPointsGraphics[key][subKey] = dataPointGraphicsObj[subKey];
      });
    }
  }
  return groupdedDataPointsGraphics;
}

/**
 * filter given data points base on given filter type
 *
 * @param {Array} data data points array
 * @param {String} filterType in one of the following: "mms", "rri", "red falg", "yellow flag" or "no issues"
 */
export function getFilteredData(data, filterType) {
  let filteredData;
  // return array of data points whose value of "flag" property is "R"
  switch (filterType) {
    case LAYER_FILTER_TYPES["Red Flag"].name:
      filteredData = data.filter(
        (d) => d[LAYER_FILTER_TYPES["Red Flag"].keyName].toLowerCase() === "r"
      );
      break;
    case LAYER_FILTER_TYPES["Yellow Flag"].name:
      filteredData = data.filter((d) =>
        d[LAYER_FILTER_TYPES["Yellow Flag"].keyName].toLowerCase().includes("y")
      );
      break;
    case LAYER_FILTER_TYPES.MMS.name:
      filteredData = data.filter(
        (d) =>
          d[LAYER_FILTER_TYPES.MMS.keyName].toLowerCase() !== "null" &&
          d["flag"] === "N"
      );
      break;
    case LAYER_FILTER_TYPES.RRI.name:
      filteredData = data.filter(
        (d) =>
          d[LAYER_FILTER_TYPES.RRI.keyName].toLowerCase() !== "null" &&
          d["flag"] === "N"
      );
      break;
    case LAYER_FILTER_TYPES["No Issues"].name:
      filteredData = data.filter(
        (d) =>
          d["damage_type"].toLowerCase() === "null" &&
          d["road_related_issues"] === "null".toLowerCase() &&
          d["flag"].toLowerCase() === "n"
      );
      break;
    default:
      filteredData = data.filter((d) => d[filterType].toLowerCase() !== "null");
  }
  return filteredData;
}
