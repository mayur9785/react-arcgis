import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { MapContext } from "../../context/mapContext";
import { isEmptyObject } from "../../utils/utilFunctions/utilFunctions";
import { IrisIcon } from "../icon/irisIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function DropDownList(props) {
  const { setters } = useContext(MapContext);
  const { setZoomToSelectedData, setSelectedData } = setters;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { title, data, filterType, logo } = props;
  const handleClick = () => {
    setOpen(!open);
  };

  const zoomToDataPoint = (data, indexInList) => {
    setSelectedIndex(indexInList);
    if (setZoomToSelectedData && setSelectedData) {
      setSelectedData(data);
      setZoomToSelectedData(true);
    }
  };

  return (
    <List aria-labelledby="nested-list-subheader" className={classes.root}>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <img src={logo} height={25} />
        </ListItemIcon>
        <ListItemText primary={`On ${title}`} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {data.map((d, index) => (
          <List
            component="div"
            disablePadding
            key={index}
            onClick={() => zoomToDataPoint(d, index)}
          >
            <ListItem
              button
              className={classes.nested}
              selected={selectedIndex === index}
            >
              <ListItemIcon>
                <img src={logo} height={20} />
              </ListItemIcon>
              <ListItemText primary={d[filterType]} />
            </ListItem>
          </List>
        ))}
      </Collapse>
    </List>
  );
}
export default function DropDownListPanel(props) {
  const { values } = useContext(MapContext);

  const [filteredGroupData, setFilteredGroupData] = useState([]);

  const { dataPoints } = values;
  useEffect(() => {
    const filteredData = dataPoints.filter(
      (data) => data[props.filterType] !== "N / A"
    );
    const groupedData = filteredData.reduce((acc, element) => {
      const timeString = element["create_time"].split("T")[0];
      const key = timeString.split(" ")[0];
      const currentValues = acc[key] || [];
      currentValues.push(element);
      return { ...acc, [key]: currentValues };
    }, {});
    setFilteredGroupData(groupedData);
  }, [dataPoints]);
  return (
    <div>
      <img
        width="100%"
        src="https://s3.ca-central-1.amazonaws.com/iport-images/media/Hamilton/2020/5/22/1a23dea6b787da3a/2020522_10517_yolo_out_py.png"
      />
      {isEmptyObject(filteredGroupData) ? (
        <div>
          <h1>No data found</h1>
          <IrisIcon
            src="https://irisradgroup.maps.arcgis.com/sharing/rest/content/items/1402078d37094752a3632510e7006123/data"
            size={250}
          />
        </div>
      ) : (
        <div>
          {Object.keys(filteredGroupData).map((keyName) => (
            <div key={keyName}>
              <DropDownList
                title={keyName}
                data={filteredGroupData[keyName]}
                logo={props.logo}
                filterType={props.filterType}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
