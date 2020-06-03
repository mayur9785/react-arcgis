import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import { DATA_POINT_DETAILS_TITLES } from "../../constants/mapConstants";
import { isValidObj } from "../../utils/utilFunctions/utilFunctions";
import { Button } from "@material-ui/core";
import { MapContext } from "../../context/mapContext";

export function DataPontDetails(props) {
  console.log("I am here");
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
            }
            if (!isValidObj(value) || value.toLowerCase() === "null") {
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
              <Button variant="contained" color="primary">
                Create Work Flow
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary">
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
