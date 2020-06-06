import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import {
  DATA_POINT_DETAILS_TITLES,
  LAYER_FILTER_TYPES,
} from "../../constants/mapConstants";
import { isValidObj } from "../../utils/utilFunctions/utilFunctions";
import { Button } from "@material-ui/core";
import { MapContext } from "../../context/mapContext";

const isPerfectData = (data) => {
  return (
    data[LAYER_FILTER_TYPES.MMS.keyName] === "N / A" &&
    data[LAYER_FILTER_TYPES.RRI.keyName] === "N / A" &&
    data[LAYER_FILTER_TYPES["Red Flag"].keyName].toLowerCase() === "n"
  );
};

export function DataPontDetails(props) {
  const { values } = useContext(MapContext);
  const { selectedData } = values;

  return (
    <div>
      {selectedData ? (
        <div>
          <a href={selectedData.image} target="_blank">
            <img src={selectedData.image} width="100%" />
          </a>
          {DATA_POINT_DETAILS_TITLES.map((title) => {
            let value = selectedData[title.keyName];
            if (title.keyName.toLowerCase() === "location") {
              value = `( ${selectedData.latitude}, ${selectedData.longitude} )`;
            } else if (title.keyName.toLowerCase() === "device_sn") {
              value = selectedData["device_sn"]["device_sn"];
            }
            if (!isValidObj(value) || value === null) {
              value = "N/A";
            }
            return (
              <Grid container key={title.name}>
                <Grid item sm={4} style={{ textAlign: "start" }}>
                  <h2>{title.name}</h2>
                </Grid>
                <Grid item sm={8} style={{ textAlign: "start" }}>
                  <h2> {value}</h2>
                </Grid>
              </Grid>
            );
          })}

          <Grid container justify="space-around">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={isPerfectData(selectedData)}
              >
                Create Work Flow
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                disabled={isPerfectData(selectedData)}
              >
                Resolve
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : (
        <h1>No selected data</h1>
      )}
    </div>
  );
}
