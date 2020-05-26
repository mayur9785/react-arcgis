import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Divider } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DATE_FILTER_TYPE } from "../../constants/mapConstants";
import { LAYER_TYPES } from "../../containers/mapUtils/mapUtils";

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
}));
export default function PanelTabs(props) {
  const { updateSelectedLayers, updateFilterType } = props;
  const layerNames = Object.keys(LAYER_TYPES).map((key) => LAYER_TYPES[key]);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const [selectedLayers, setSelectedLayers] = useState([]);
  const [currentFilterType, setCurrentFilterType] = useState(
    props.selectedFilterType || ""
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectedLayers = (event) => {
    const layers = event.target.value;
    setSelectedLayers(layers);
    debugger;
    updateSelectedLayers(layers);
  };

  const handleFilterTypeChange = (event) => {
    const updatedFilter = event.target.value;
    setCurrentFilterType(updatedFilter);
    updateFilterType(updatedFilter);
    debugger;
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="iris arcgis map panel label"
        >
          <Tab label="Filters" {...a11yProps(0)} />
          <Tab label="Details" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel id="mutiple-feature-layers-label">Layers</InputLabel>
          <Select
            labelId="layerSelectorLabel"
            id="layerSelectorLabel"
            multiple
            value={selectedLayers}
            onChange={handleSelectedLayers}
            input={<Input />}
            renderValue={(selected) => selected.join(", ")}
            // MenuProps={MenuProps}
          >
            {layerNames.map((layer) => (
              <MenuItem key={layer} value={layer}>
                <Checkbox
                  checked={
                    selectedLayers ? selectedLayers.indexOf(layer) > -1 : false
                  }
                />
                <ListItemText primary={layer} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            fullWidth
            // disableToolbar
            id="datePickerId"
            format="yyyy-MM-dd"
            variant="inline"
            margin="normal"
            label="Select a date"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            maxDate={new Date()}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel id="filterDateTypeLabel">Filter by</InputLabel>
          <Select
            native
            value={currentFilterType}
            disabled={selectedLayers.indexOf(LAYER_TYPES.DATA_POINT_LAYER) < 0}
            onChange={handleFilterTypeChange}
            inputProps={{
              name: "age",
              id: "age-native-simple",
            }}
          >
            {Object.keys(DATE_FILTER_TYPE).map((filterKey) => (
              <option key={filterKey} value={DATE_FILTER_TYPE[filterKey]}>
                {DATE_FILTER_TYPE[filterKey]}
              </option>
            ))}
          </Select>
        </FormControl>
      </TabPanel>

      <TabPanel value={value} index={1}>
        details
      </TabPanel>
    </div>
  );
}
