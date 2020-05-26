import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const layers = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const defaultLayerObj = [
  { name: "Boundary Layer", selected: false },
  { name: "Districs Layer", selected: false },
  { name: "Data Point Layer", selected: false },
];
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function ArcgisHeader(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const [layers, setLayers] = useState(defaultLayerObj);
  const [selectedLayers, setSelectedLayers] = useState([]);

  const handleChange = (event) => {
    // setPersonName(event.target.value);
    const selectedLayerName = event.target.value[0].name;
    if (selectedLayerName) {
      const copiedLayers = [...layers];
      for (const layer of copiedLayers) {
        if (layer.name.toLowerCase() === selectedLayerName.toLowerCase()) {
          layer.selected = !layer.selected;
        }
      }
      const selectedLayer = [];
      for (const layer of copiedLayers) {
        if (layer.selected) {
          selectedLayer.push(layer.name);
        }
      }
      props.setSelectedLayer(selectedLayer);
      setLayers(copiedLayers);
    }
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setPersonName(value);
  };

  const LAYER_ID = "layer-id";
  const DATE_SELECTOR_ID = "data-delector-id";
  const DATE_PICKER_ID = "date-picker-id";

  // const layers = ["Boundary Layer", "Districs Layer", "Data Point Layer"];
  // const layers = [
  //   { name: "Boundary Layer", selected: false },
  //   { name: "Districs Layer", selected: false },
  //   { name: "Data Point Layer", selected: false },
  // ];

  const dateTypes = ["Year", "Month", "Week", "Day"];

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-name-label">Layers</InputLabel>
        <Select
          // fullWidth={true}
          labelId="demo-mutiple-name-label"
          id="demo-mutiple-name"
          multiple
          value={selectedLayers}
          onChange={handleChange}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {layers.map((type, index) => (
            <MenuItem key={index} value={type}>
              <Checkbox checked={type.selected} />
              <ListItemText primary={type.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<Input />}
          // renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {dateTypes.map((type, index) => (
            <MenuItem key={index} value={type}>
              <Checkbox onChange={() => console.log("changed")} />
              <ListItemText primary={type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      {/* <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          // multiple
          value={personName}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          // renderValue={(selected) => (
          //   <div className={classes.chips}>
          //     {selected.map((value) => (
          //       <Chip key={value} label={value} className={classes.chip} />
          //     ))}
          //   </div>
          // )}
          MenuProps={MenuProps}
        >
          {layers.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={clsx(classes.formControl, classes.noLabel)}>
        <Select
          // multiple
          displayEmpty
          value={personName}
          onChange={handleChange}
          input={<Input />}
          // renderValue={(selected) => {
          //   if (selected.length === 0) {
          //     return <em>Placeholder</em>;
          //   }

          //   return selected.join(", ");
          // }}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled value="">
            <em>Placeholder</em>
          </MenuItem>
          {layers.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
    </div>
  );
}
