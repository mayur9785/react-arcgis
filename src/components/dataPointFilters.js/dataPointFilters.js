import React from 'react'
import React, { useState } from "react";
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
import { DATA_POINT_FILTER_TYPE } from "../../constants/mapConstants";
import { LAYER_TYPES } from "../../containers/mapUtils/mapUtils";
export function DataPointFilters(props){


    return(
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
            {Object.keys(DATA_POINT_FILTER_TYPE).map((filterKey) => (
              <option key={filterKey} value={DATA_POINT_FILTER_TYPE[filterKey]}>
                {DATA_POINT_FILTER_TYPE[filterKey]}
              </option>
            ))}
          </Select>
        </FormControl>
    )
}