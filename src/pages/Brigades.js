import React from 'react';
import Map from '../components/Map/Map';

function Brigades() {
  return (
    <>
      <h2>Brigades page!</h2>
      {/* List projects by brigades that are shown on accompanying map */}
      {/* When map zooms or moves, re-filter geographically */}
      {/* Accessible filter by region, state, or a single brigade */}
      <Map />
    </>
  );
}

export default Brigades;
