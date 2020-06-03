import React, { useContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { DataPontDetails } from "../dataPointDetails/dataPointDetails";
import { DataPointFilters } from "../dataPointFilters.js/dataPointFilters";
import { MapContext } from "../../context/mapContext";
import DropDownListPanel from "../flagDataPoints/dropDownListPanel";
import redFlag from "../../assets/arcgisMapIcons/mms_warning.jpg";
import yellowFlag from "../../assets/arcgisMapIcons/rri_warning.jpg";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },

  tabStyle: {
    "@media (min-width: 600px)": {
      minWidth: "125px",
    },
  },
}));
export default function RightPanelTabs(props) {
  const { values, setters } = useContext(MapContext);
  const { selectedPanelIndex } = values;
  const { setSelectedPanelIndex } = setters;
  const { updateZoomLocation } = props;
  // const layerNames = Object.keys(LAYER_TYPES).map((key) => LAYER_TYPES[key]);
  const classes = useStyles();
  // const [selectedPanelIndex, setSelectedPanelIndex] = React.useState(0);

  const handleChange = (event, newValue) => {
    setSelectedPanelIndex(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={selectedPanelIndex}
          onChange={handleChange}
          aria-label="iris arcgis map panel label"
        >
          <Tab label="Filters" className={classes.tabStyle} {...a11yProps(0)} />
          <Tab label="MMS" className={classes.tabStyle} {...a11yProps(1)} />
          <Tab label="RRI" className={classes.tabStyle} {...a11yProps(2)} />
          <Tab label="Details" className={classes.tabStyle} {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedPanelIndex} index={0}>
        <DataPointFilters />
      </TabPanel>
      <TabPanel value={selectedPanelIndex} index={1}>
        <DropDownListPanel logo={redFlag} filterType="damage_type" />
      </TabPanel>
      <TabPanel value={selectedPanelIndex} index={2}>
        <DropDownListPanel logo={yellowFlag} filterType="road_related_issues" />
      </TabPanel>

      <TabPanel value={selectedPanelIndex} index={3}>
        <DataPontDetails updateZoomLocation={updateZoomLocation} />
      </TabPanel>
    </div>
  );
}
