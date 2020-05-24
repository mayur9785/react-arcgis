import { loadModules } from "esri-loader";
import { styleFont } from "./mapStyleUtils";
import { isValidObj } from "../../utils/utilFunctions/utilFunctions";
const shp = require("shpjs");

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

export async function getBaseMap(mapTypeString = "topo-vector") {
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

  const { type, symbol } = graphicsOptions;
  const arcgisGraphic = data.map((d) => {
    return new GraphicsClass({
      attributes: getTableKeyValue(d.properties),
      geometry: {
        type: type,
        paths: d.coordinates,
      },
      symbol: symbol,
    });
  });
  return arcgisGraphic;
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
      const pathsGraphics = getGraphic(paths, GraphicsClass, {
        type: graphicType,
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
