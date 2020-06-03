import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../../components/Map/Map';
import {
  filterBy,
  cleanBrigadeData,
  getProjectsFromBrigadeData,
  getBaseApiUrl,
} from '../../utils';
import './Brigades.scss';
import ProjectsTable from '../../components/ProjectsTable/ProjectsTable';

function Brigades() {
  // Filter projects by zoomed in area of map, unless a state or brigade is highlighted

  // Changing map changes which filter function we use to filter projects
  // One filter func for brigades, one for state, one for bounding box
  const [brigadeData, setBrigadeData] = useState();
  const [tagData, setTagData] = useState();
  const [filterOpts, setFilterOpts] = useState();
  const projects = getProjectsFromBrigadeData(brigadeData, filterOpts);

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      setBrigadeData(cleanBrigadeData(brigades));
      const tags = await axios.get(`${getBaseApiUrl()}/api/tags.json`);
      setTagData(tags.data);
    };
    getData();
  }, []);

  console.log(brigadeData);

  return (
    <>
      <h2>Projects by brigade, state, or geographic area</h2>
      {/* List projects by brigades that are shown on accompanying map */}
      {/* When map zooms or moves, re-filter geographically */}
      {/* Accessible filter by region, state, or a single brigade */}
      <div className="brigades-page-content">
        <Map brigadeData={brigadeData} />
        <div className="map-info">
          <p>
            Move the map or zoom in to filter by projects in a geographic area.
            Click a state on the map or use the dropdown to filter projects by
            state. Click a brigade or select from the dropdown to look for
            projects owned by a single brigade.
          </p>
          {/* TODO: FIGURE OUT WHAT GOES HERE */}
          {brigadeData && (
            <div>
              <label htmlFor="state-picker">Select a brigade</label>
              <select id="state-picker">
                {brigadeData.map((brigade) => (
                  <option>{brigade.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <ProjectsTable projects={projects} />
    </>
  );
}

export default Brigades;
