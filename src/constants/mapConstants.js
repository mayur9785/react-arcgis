export const GEOMETRY_TYPES = {
  POINT: "point",
  POLY_LINE: "polyline",
  POLYGON: "polygon",
};

// simple markers for Arcgis map
export const SYMBOL_MARKERS = {
  LINE: "polyline",
  MARKER: "simple-marker",
};

/**
 * categories for grouping data points
 */
export const DATA_POINT_GROUP_TYPES = {
  DATE: "Date",
  MONTH: "Month",
  YEAR: "Year",
  PCI: "PCI",
};

/**
 * filter data on arcgis based on whether
 * there is deffects, road issues, marked with flas
 * or none of them
 */

export const LAYER_FILTER_TYPES = {
  "No Issues": { name: "No Issues", keyName: " N/ A" },
  MMS: { name: "MMS", keyName: "damage_type" },
  RRI: { name: "RRI", keyName: "road_related_issues" },
  "Red Flag": { name: "Red Flag", keyName: "flag" },
  "Yellow Flag": { name: "Yellow Flag", keyName: "flag" },
};

/**
 * use to show data point details
 * where "name" is the title and
 * "keyName" is the property name
 * of data point where desired value
 * is located
 */
export const DATA_POINT_DETAILS_TITLES = [
  { name: "PCI", keyName: "pci" },
  { name: "RRI", keyName: "road_related_issues" },
  { name: "Defficiency", keyName: "damage_type" },
  { name: "Location", keyName: "Location" },
  { name: "Address", keyName: "address" },
  { name: "Patrollor", keyName: "patrollor" },
  { name: "Vehicle", keyName: "device_sn" },
];

// map types of Arcgis map
export const ARCGIS_MAP_TYPES = {
  TOPO: "topo",
  STREETS: "streets",
  SATELLITE: "satellite",
  HYBRID: "hybrid",
  DARK_GRAY: "dark-gray",
  GRAY: "gray",
  NATIONAL_GEOGRAPHIC: "national-geographic",
  OCEANS: "oceans",
  OSM: "osm",
  TERRAIN: "terrain",
  DARK_GRAY_VECTOR: "dark-gray-vector",
  GRAY_VECTOR: "gray-vector",
  STREETS_VECTOR: "streets-vector",
  STREETS_NIGHT_VECTOR: "streets-night-vector",
  STREETS_NAVIGATION_VECTOR: "streets-navigation-vector",
  TOPO_VECTOR: "topo-vector",
  STREETS_EFLIEF_VECTOR: "streets-relief-vector",
};

// size of marker whose symbol is "simple-marker"
// which is a solid dot shown on map
export const DEFAULT_SYMBOL_SIZE = "7px";

// line with of marker whose symbol is line
export const DEFAULT_MARKER_WIDTH = 1;

export const DEFAULT_MARKER_ALPHA = 0.8;

// some default marker for arcgis map
export const DATA_POINT_MARKER_SYMBOLS = {
  DEFAULT: {
    size: DEFAULT_SYMBOL_SIZE,
    type: "simple-marker",
    color: [41, 171, 135, DEFAULT_MARKER_ALPHA],
    width: DEFAULT_MARKER_WIDTH,
  },
  PRIMARY: {
    size: DEFAULT_SYMBOL_SIZE,
    type: "simple-marker",
    color: [208, 2, 5, DEFAULT_MARKER_ALPHA],
    width: DEFAULT_MARKER_WIDTH,
  },
  SECONDARY: {
    size: DEFAULT_SYMBOL_SIZE,
    type: "simple-marker",
    color: [65, 125, 225, DEFAULT_MARKER_ALPHA],
    width: DEFAULT_MARKER_WIDTH,
  },
  WARNNING: {
    size: DEFAULT_SYMBOL_SIZE,
    type: "simple-marker",
    color: [255, 186, 0, DEFAULT_MARKER_ALPHA],
    width: DEFAULT_MARKER_WIDTH,
  },
};

export const PCI_VALUES = {
  GOOD: "good",
  FAIR: "fair",
  POOR: "poor",
  VERY_POOR: "very poor",
};
