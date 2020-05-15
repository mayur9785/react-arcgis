import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

export const MyMap = () => {
    const mapRef = useRef();
    useEffect(
        () => {
            // lazy load the required ArcGIS API for JavaScript modules and CSS
            loadModules(["esri/WebScene", 'esri/views/SceneView', "esri/layers/CSVLayer"])
                .then(([ArcGISMap, MapView]) => {
                    var webmap = new ArcGISMap({
                        basemap: 'topo-vector'
                    });

                    var view = new MapView({
                        map: webmap,
                        popup: {
                            dockEnabled: true,
                            dockOptions: {
                                // Disables the dock button from the popup
                                buttonEnabled: false,
                                // Ignore the default sizes that trigger responsive docking
                                breakpoint: false
                            }
                        },
                        container: mapRef.current
                    });

                    var popup = view.popup;

                    view.when(function () {
                        var centerPoint = view.center.clone();

                        popup.open({
                            title: "Popup dock positions",
                            location: centerPoint,
                            content:
                                "Use the control in the center of the map to change the location where the popup will dock."
                        });

                        // Watch currentDockPosition of the popup and open the
                        // popup at the specified position.
                        popup.watch("currentDockPosition", function (value) {
                            popup.visible = true;
                        });

                        var selectNode = document.getElementById("dockPositionControl");

                        // Let user change the position dockOptions.position property of the
                        // popup at runtime from the drop-down list.
                        selectNode.addEventListener("change", function (event) {
                            popup.set("dockOptions", {
                                breakpoint: false,
                                buttonEnabled: false,
                                position: event.target.value
                            });
                        });
                    });

                    return () => {
                        if (view) {
                            // destroy the map view
                            view.container = null;
                        }
                    };
                });
        }
    );

    return <div className="webmap" style={{ height: "100vh" }} ref={mapRef} />;
};


// import React, { useEffect, useRef } from 'react';
// import ArcGISMap from 'esri/Map';
// import MapView from 'esri/views/MapView';

// export const MyMap = () => {
//     const mapRef = useRef();

//     useEffect(
//         () => {
//             // create map
//             const map = new ArcGISMap({
//                 basemap: 'topo-vector'
//             });

//             // load the map view at the ref's DOM node
//             const view = new MapView({
//                 container: mapRef.current,
//                 map: map,
//                 center: [-118, 34],
//                 zoom: 8
//             });

//             return () => {
//                 if (view) {
//                     // destroy the map view
//                     view.container = null;
//                 }
//             };
//         }
//     );

//     return <div className="webmap" ref={mapRef} />;
// };