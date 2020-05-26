import React from "react";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import { DATA_POINT_DETAILS_TITLES } from "../../constants/mapConstants";
import { isValidObj } from "../../utils/utilFunctions/utilFunctions";
import { Button } from "@material-ui/core";

export function DataPontDetails(props) {
  const { updateZoomLocation } = props;
  const selectedData = {
    comment: "",
    edited: "Y",
    session: "9",
    change_time: "5/10/2020 2:50:58 PM",
    create_time: "5/10/2020 1:44:57 PM",
    road_related_issues: "null",
    image:
      "https://s3.ca-central-1.amazonaws.com/iport-images/media/TestCity/2020/5/10/471ffa08c0acbdb2/2020510_94457_yolo_out_py.png",
    longitude: "-79.8958475",
    heading: "215.9947815",
    pci: "Good",
    auditor: "null",
    latitude: "43.2906462",
    detail_from_city: "null",
    exported: "N",
    app_version: "1",
    id: "26364",
    device_sn: "471ffa08c0acbdb2",
    damage_type: "null",
    city: "TestCity",
    address: "ON-403, Hamilton, ON L0R, Canada",
    flag: "N",
    date: "Collected on 2020-05-10",
    current_city: "Hamilton",
  };

  function handleZoom() {
    if (updateZoomLocation) {
      updateZoomLocation({
        latitude: selectedData.latitude,
        longitude: selectedData.longitude,
      });
    }
  }
  return (
    <div>
      {/* <div style={{ cursor: "pointer" }} onClick={showImage}>
        <img src={selectedData.image} width="100%" />
      </div> */}
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
          <Button variant="outlined" color="secondary" onClick={handleZoom}>
            Zoom to Map
          </Button>
        </Grid>
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
  );
}
