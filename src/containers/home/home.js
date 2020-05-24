import React, { Component } from "react";
import ArcgisHeader from "../arcgisHeader/arcgisHeader";
import { ArcgisMap } from "../../components/mapComonent/ArcgisMap";
import LoadingOverlay from "../../components/ui/loadingOverlay/loadingOverlay";

export default class IrisArcgisHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLayer: [],
      isLoading: false,
    };
  }

  setSelectedLayer = (toggledLayers) => {
    console.log("toggledLayers", toggledLayers);
    this.setState({
      selectedLayer: toggledLayers,
    });
  };

  setLoading = (isLoading) => {
    this.setState({
      isLoading: isLoading,
    });
  };
  render() {
    return (
      <div>
        <ArcgisHeader
          dateType={this.state.dateType}
          // setSelectedData={setSelectedData}
          setSelectedLayer={this.setSelectedLayer}
        />
        <ArcgisMap
          layerList={this.state.selectedLayer}
          setLoading={this.setLoading}
        />
        {this.state.isLoading ? <LoadingOverlay /> : null}
      </div>
    );
  }
}
