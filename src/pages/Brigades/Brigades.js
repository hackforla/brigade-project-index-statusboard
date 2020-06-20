import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../../components/Map/Map';
import {
  cleanBrigadeData,
  getProjectsFromBrigadeData,
  getBaseApiUrl,
  filterBrigades,
} from '../../utils';
import { ProjectsTable, Select, RadioGroup } from '../../components';
import './Brigades.scss';

function Brigades() {
  // Filter projects by zoomed in area of map, unless a state or brigade is highlighted
  // Changing map changes which filter function we use to filter projects
  // One filter func for brigades, one for state, one for bounding box
  const [brigadeData, setBrigadeData] = useState();
  const [filteredBrigadeData, setFilteredBrigadeData] = useState([]);
  // const [tagData, setTagData] = useState();
  const [filterOpts, setFilterOpts] = useState({});
  const { selectedBrigade, bounds } = filterOpts;
  const [projects, setProjects] = useState(
    getProjectsFromBrigadeData(filteredBrigadeData, filterOpts)
  );

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      setBrigadeData(cleanBrigadeData(brigades));
      // const tags = await axios.get(`${getBaseApiUrl()}/api/tags.json`);
      // setTagData(tags.data);
    };
    getData();
  }, []);

  useEffect(() => {
    const newlyFilteredBrigadeData = filterBrigades(brigadeData, filterOpts);
    setFilteredBrigadeData(newlyFilteredBrigadeData);
    setProjects(getProjectsFromBrigadeData(newlyFilteredBrigadeData));
  }, [brigadeData, filterOpts]);

  let brigadesShowingString = 'Showing projects from ';
  const firstTenBrigades = filteredBrigadeData.map((b) => b.name).slice(0, 10);
  if (selectedBrigade) {
    brigadesShowingString = `${brigadesShowingString} ${selectedBrigade.name}`;
  } else {
    brigadesShowingString = `${brigadesShowingString} ${firstTenBrigades.join(
      ', '
    )}`;
  }
  if (filteredBrigadeData.length > 10) {
    brigadesShowingString = `${brigadesShowingString} and ${
      filteredBrigadeData.length - 10
    } other brigades`;
  }
  if (filteredBrigadeData.length === 0 && !selectedBrigade) {
    brigadesShowingString = 'No brigades selected or showing on map.';
  }

  return (
    <>
      <h2>Projects by brigade, state, or geographic area</h2>
      {/* List projects by brigades that are shown on accompanying map */}
      {/* When map zooms or moves, re-filter geographically */}
      {/* Accessible filter by region, state, or a single brigade */}
      <div className="brigades-page-content">
        <Map
          brigadeData={brigadeData}
          filterOpts={filterOpts}
          setFilterOpts={setFilterOpts}
        />
        <div className="map-info">
          {/* <RadioGroup options={['red']} selected={'red'} /> */}
          <p>Zoom in on the map to filter by projects in a geographic area.</p>
          <p>{brigadesShowingString}</p>
          <p>
            Click a brigade or select from the dropdown to look for projects
            owned by a single brigade.
          </p>
          <div>
            <Select
              label="Select a brigade"
              id="select-brigade"
              emptyOptionText="All brigades/filter with map"
              options={(brigadeData || [])
                .filter((b) => !!b.latitude && !!b.longitude)
                .map((b) => b.name)}
              selected={
                filterOpts && selectedBrigade ? selectedBrigade.name : undefined
              }
              onChange={(event) =>
                setFilterOpts(() => ({
                  selectedBrigade: brigadeData.find(
                    (b) => b.name === event.target.value
                  ),
                }))
              }
            />
          </div>
        </div>
      </div>
      <ProjectsTable projects={projects} />
    </>
  );
}

export default Brigades;
