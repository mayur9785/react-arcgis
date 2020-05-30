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

// filter types for filtering data points
export const DATA_POINT_FILTER_TYPES = {
  DATE: "Date",
  MONTH: "Month",
  YEAR: "Year",
  PCI: "PCI",
  MMS: "MMS Defects",
  RRI: "Road Related Issues",
  FLAGS: "Flags",
};

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

export const DEFAULT_SYMBOL_SIZE = "12px";
export const DEFAULT_MARKER_WIDTH = 1;
export const DEFAULT_MARKER_ALPHA = 0.8;
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
