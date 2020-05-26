import React, { useState, useContext } from "react";
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
import {
  DATA_POINT_FILTER_TYPES,
  ARCGIS_MAP_TYPES,
} from "../../constants/mapConstants";
import { LAYER_TYPES } from "../../containers/mapUtils/mapUtils";
import { MapContext } from "../../context/mapContext";
export function DataPointFilters(props) {
  const { values, setters } = useContext(MapContext);

  const {
    mapType,
    dataFilterType,
    selectedData,
    selectedDate,
    selectedLayers,
  } = values;
  const {
    setMapType,
    setDataFilterType,
    setSelectedData,
    setSelectedDate,
    setSelectedLayers,
  } = setters;

  const layerNames = Object.keys(LAYER_TYPES).map((key) => LAYER_TYPES[key]);

  function handleSelectedLayers(event) {
    if (setSelectedLayers) {
      const layers = event.target.value;
      setSelectedLayers(layers);
    }
  }

  function handleFilterTypeChange(event) {
    if (setDataFilterType) {
      const updatedFilter = event.target.value;
      setDataFilterType(updatedFilter);
    }
  }

  function handleMapTypeChange(event) {
    console.log(event.target.value);
    if (setMapType) {
      const updatedMaptype = event.target.value;
      debugger;
      setMapType(updatedMaptype);
    }
  }
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="arcgis-map-type-label">Map Type</InputLabel>
        <Select
          labelId="arcgisMapSelectLabel"
          id="arcgisMapSelectLabel"
          value={mapType}
          onChange={handleMapTypeChange}
        >
          {/* <MenuItem value={10}>Ten</MenuItem> */}
          {Object.keys(ARCGIS_MAP_TYPES).map((mapKey) => (
            <MenuItem key={mapKey} value={ARCGIS_MAP_TYPES[mapKey]}>
              {ARCGIS_MAP_TYPES[mapKey]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
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
      <FormControl fullWidth>
        <InputLabel id="filterDateTypeLabel">Filter by</InputLabel>
        <Select
          native
          value={dataFilterType}
          disabled={selectedLayers.indexOf(LAYER_TYPES.DATA_POINT_LAYER) < 0}
          onChange={handleFilterTypeChange}
          inputProps={{
            name: "layers",
            id: "layers",
          }}
        >
          {Object.keys(DATA_POINT_FILTER_TYPES).map((filterKey) => (
            <option key={filterKey} value={DATA_POINT_FILTER_TYPES[filterKey]}>
              {DATA_POINT_FILTER_TYPES[filterKey]}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
