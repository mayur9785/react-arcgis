import React, { useState, createContext } from "react";

export const MapContext = createContext();

export function MapContextProvider(props) {
  return <MapContext.Provider value={}>{props.children}</MapContext.Provider>;
}
