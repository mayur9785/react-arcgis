import React, { useState, useContext } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { ArcgisMap } from "../../components/mapComonent/ArcgisMap";
import PanelTabs from "../../components/leftPanel/leftPanel";
import { DATA_POINT_GROUP_TYPES } from "../../constants/mapConstants";
import { MapContext } from "../../context/mapContext";

const drawerWidth = 500;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const { values, setters } = useContext(MapContext);
  const { openPanel } = values;
  const { setOpenPanel } = setters;

  const handleDrawerOpen = () => {
    setOpenPanel(true);
  };

  const handleDrawerClose = () => {
    setOpenPanel(false);
  };

  const [selectedLayers, setSelectedLayers] = useState([]);
  const [selectedFilterType, setSelectedFilterType] = useState(
    DATA_POINT_GROUP_TYPES.DATE
  );

  const [selectedData, setSelectedData] = useState(null);

  const [zoomLocation, setZoomLocation] = useState(null);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openPanel,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.arrowButton, openPanel && classes.hide)}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Iris Arcgis Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openPanel}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <PanelTabs
          updateSelectedLayers={setSelectedLayers}
          updateFilterType={setSelectedFilterType}
          selectedFilterType
          updateZoomLocation={setZoomLocation}
        />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openPanel,
        })}
      >
        <div className={classes.drawerHeader} />
        <ArcgisMap
          layerList={selectedLayers}
          selectedFilterType={selectedFilterType}
          zoomLocation={zoomLocation}
        ></ArcgisMap>
      </main>
    </div>
  );
}
