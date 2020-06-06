import React, { useState, useContext } from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  DATA_POINT_GROUP_TYPES,
  ARCGIS_MAP_TYPES,
  LAYER_FILTER_TYPES,
} from "../../constants/mapConstants";
import { LAYER_TYPES } from "../../containers/mapUtils/mapUtils";
import { MapContext } from "../../context/mapContext";
import { Button } from "@material-ui/core";
import { getDataByDate } from "../../utils/utilFunctions/backendUtils";
import { convertData } from "../../utils/utilFunctions/utilFunctions";
export function DataPointFilters(props) {
  const { values, setters } = useContext(MapContext);

  const {
    mapType,
    dataGroupType,
    layerFilterTypes,
    selectedData,
    selectedDate,
    selectedLayers,
  } = values;
  const {
    setMapType,
    setDataGroupType,
    setLayerFilterTypes,
    setSelectedData,
    setSelectedDate,
    setSelectedLayers,
  } = setters;

  const layerNames = Object.keys(LAYER_TYPES).map((key) => LAYER_TYPES[key]);

  function handleSelectedLayers(event) {
    if (setSelectedLayers) {
      const layers = event.target.value;
      setSelectedLayers(layers);
      debugger;
    }
  }

  function handleFilterTypeChange(event) {
    if (setDataGroupType) {
      const updatedFilter = event.target.value;
      setDataGroupType(updatedFilter);
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

  function handleFilterCheck(event) {
    let currentLayerFilters = [...layerFilterTypes];
    const checked = event.target.checked;
    const value = event.target.value;
    if (checked) {
      currentLayerFilters.push(value);
    } else {
      currentLayerFilters = currentLayerFilters.filter(
        (layerFilter) => layerFilter !== value
      );
    }
    setLayerFilterTypes(currentLayerFilters);
  }

  async function handleSearch() {
    try {
      setters.setLoadingMessage("0.00%");
      setters.setIsLoading(true);
      let allData = [];
      let result = await getDataByDate(null, selectedDate);
      const count = result.count;
      if (count === 0) {
        return;
      }
      do {
        const transormedDataPoints = result.results.map((data) =>
          convertData(data)
        );
        allData = [...allData, ...transormedDataPoints];
        const updatedPercentage = ((allData.length * 100) / count).toFixed(2);
        setters.setLoadingMessage(updatedPercentage);
        result = await getDataByDate(result.next);
      } while (result.next);
      setters.setDataPoints(allData);
    } catch (error) {
      console.log("Error in searching data points", error);
    } finally {
      setters.setIsLoading(false);
      setters.setLoadingMessage(null);
    }
  }
  return (
    <FormGroup>
      <FormControl fullWidth style={{ marginBottom: "1rem" }}>
        <InputLabel id="arcgis-map-type-label">Map Type</InputLabel>
        <Select
          labelId="arcgisMapSelectLabel"
          id="arcgisMapSelectLabel"
          value={mapType}
          onChange={handleMapTypeChange}
        >
          {Object.keys(ARCGIS_MAP_TYPES).map((mapKey) => (
            <MenuItem key={mapKey} value={ARCGIS_MAP_TYPES[mapKey]}>
              {ARCGIS_MAP_TYPES[mapKey]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        style={{ marginBottom: "1rem" }}
      >
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
      <Button
        variant="outlined"
        color="primary"
        style={{ marginBottom: "1rem" }}
        onClick={handleSearch}
      >
        Search
      </Button>

      {values.dataPoints.length === 0 ? null : (
        <div>
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
                      selectedLayers
                        ? selectedLayers.indexOf(layer) > -1
                        : false
                    }
                  />
                  <ListItemText primary={layer} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth style={{ margin: "1rem 0" }}>
            <InputLabel id="filterDateTypeLabel">Group layer by</InputLabel>
            <Select
              native
              value={dataGroupType}
              disabled={
                selectedLayers.indexOf(LAYER_TYPES.DATA_POINT_LAYER) < 0
              }
              onChange={handleFilterTypeChange}
              inputProps={{
                name: "layers",
                id: "layers",
              }}
            >
              {Object.keys(DATA_POINT_GROUP_TYPES).map((filterKey) => (
                <option
                  key={filterKey}
                  value={DATA_POINT_GROUP_TYPES[filterKey]}
                >
                  {DATA_POINT_GROUP_TYPES[filterKey]}
                </option>
              ))}
            </Select>
          </FormControl>

          <InputLabel style={{ textAlign: "left" }} id="filterDateTypeLabel">
            Sublayers
          </InputLabel>
          <FormGroup row>
            {Object.keys(LAYER_FILTER_TYPES).map((filterType) => (
              <FormControlLabel
                key={filterType}
                control={
                  <Checkbox
                    disabled={
                      selectedLayers.indexOf(LAYER_TYPES.DATA_POINT_LAYER) < 0
                    }
                    name={LAYER_FILTER_TYPES[filterType].name}
                    value={LAYER_FILTER_TYPES[filterType].name}
                    checked={layerFilterTypes.indexOf(filterType) > -1}
                    onChange={handleFilterCheck}
                  />
                }
                label={LAYER_FILTER_TYPES[filterType].name}
              />
            ))}
          </FormGroup>
        </div>
      )}
    </FormGroup>
  );
}
