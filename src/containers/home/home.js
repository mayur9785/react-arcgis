import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { ArcgisMap } from "../../components/mapComonent/ArcgisMap";
import RightPanelTabs from "../../components/rightPanel/rightPanel";
import { DATA_POINT_GROUP_TYPES } from "../../constants/mapConstants";
import { MapContext } from "../../context/mapContext";
import { getDataByDate } from "../../utils/utilFunctions/backendUtils";
import Spinner from "../../components/ui/spinner/Spinner";
import { convertData } from "../../utils/utilFunctions/utilFunctions";

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
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    textAlign: "left",
    flexGrow: 1,
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
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

export default function Home() {
  const theme = useTheme();
  const { values, setters } = useContext(MapContext);
  const { openPanel } = values;
  const { setOpenPanel, setDataPoints } = setters;

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
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

  const [zoomLocation, setZoomLocation] = useState(null);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  // useEffect(() => {
  //   const getAllData = async () => {
  //     setLoadingMessage("0.00%");
  //     try {
  //       setIsLoading(true);
  //       let allDataPoints = [];
  //       let result = await getDataByDate();
  //       debugger;
  //       const count = result.count;
  //       if (count === 0) {
  //         return;
  //       }
  //       do {
  //         const transferedData = result.results.map((data) => {
  //           return convertData(data);
  //         });
  //         allDataPoints = [...allDataPoints, ...transferedData];
  //         const loadingMessage = ((allDataPoints.length * 100) / count).toFixed(
  //           2
  //         );
  //         setLoadingMessage(loadingMessage + "%");
  //         result = await getDataByDate(result.next);
  //       } while (result.next);
  //       setDataPoints(allDataPoints);
  //     } catch (error) {
  //       console.log("error in getting data", error);
  //     } finally {
  //       setIsLoading(false);
  //       setLoadingMessage(null);
  //     }
  //   };
  //   getAllData();
  // }, [setDataPoints]);
  return (
    <div className={classes.root}>
      {isLoading || values.isLoading ? (
        <Spinner loadingMessage={loadingMessage || values.loadingMessage} />
      ) : null}
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openPanel,
        })}
      >
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            Iris Arcgis Portal
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
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
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={openPanel}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <h1>filter</h1>
        </div>
        <Divider />
        <RightPanelTabs
          updateSelectedLayers={setSelectedLayers}
          updateFilterType={setSelectedFilterType}
          selectedFilterType
          updateZoomLocation={setZoomLocation}
        />
      </Drawer>
    </div>
  );
}
