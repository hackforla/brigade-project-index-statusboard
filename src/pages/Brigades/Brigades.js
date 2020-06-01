import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../../components/Map/Map';
import { filterBy, cleanBrigadeData } from './utils';
import { getBaseApiUrl } from '../../utils';

function Brigades() {
  // Filter projects by zoomed in area of map, unless a state or brigade is highlighted

  // Changing map changes which filter function we use to filter projects
  // One filter func for brigades, one for state, one for bounding box
  const [brigadeData, setBrigadeData] = useState();
  const [tagData, setTagData] = useState();
  const [filterOpts, setFilterOpts] = useState();
  const projects = filterBy(brigadeData, filterOpts);

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      setBrigadeData(cleanBrigadeData(brigades));
      const tags = await axios.get(`${getBaseApiUrl()}/api/tags.json`);
      setTagData(tags.data);
    };
    getData();
  }, []);

  return (
    <>
      <h2>Brigades page!</h2>
      {/* List projects by brigades that are shown on accompanying map */}
      {/* When map zooms or moves, re-filter geographically */}
      {/* Accessible filter by region, state, or a single brigade */}
      <Map setFilterOpts={setFilterOpts} brigadeData={brigadeData} />
    </>
  );
}

export default Brigades;
