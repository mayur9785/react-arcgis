import React from 'react';
import './App.css';
import { MyMap } from './components/mapComonent/ArcgisMap';
import { StarterMap } from './components/mapComonent/starterMap';
import { MapWithLayer } from './components/mapComonent/mapWithLayer';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
      {/* <MyMap /> */}
      {/* <StarterMap /> */}
      <MapWithLayer />
      {/* </header> */}
    </div>
  );
}

export default App;
