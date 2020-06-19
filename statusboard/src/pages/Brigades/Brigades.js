import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
import { useTable, usePagination, useSortBy } from 'react-table';
import axios from 'axios';
import Map from '../../components/Map/Map';
import {
  getProjectsFromBrigadeData,
  getBaseApiUrl,
  filterBrigades,
} from '../../utils';
import { ProjectsTable, Select } from '../../components';
import './Brigades.scss';

function Brigades() {
  const [brigadeData, setBrigadeData] = useState();
  const [filteredBrigadeData, setFilteredBrigadeData] = useState();
  // const [tagData, setTagData] = useState();
  const [filterOpts, setFilterOpts] = useState({});
  const { selectedBrigade } = filterOpts; // also has bounds
  const [projects, setProjects] = useState(
    getProjectsFromBrigadeData(filteredBrigadeData, filterOpts)
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Project name',
        accessor: (project) => (
          // TODO: CHANGE THIS WHEN WE MAKE PROJECT PAGES
          // <NavLink to={`/projects/${slugify(project.slug)}`}>{project.name}</NavLink>
          <a href={project.code_url}>{project.name}</a>
        ),
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Brigade',
        accessor: 'brigade.name',
      },
    ],
    []
  );

  const tableAttributes = useTable(
    {
      columns,
      data: projects || [],
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      setBrigadeData(brigades.data);
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

  let brigadesShowingString = 'No brigades selected or showing on map.';
  if (filteredBrigadeData && filteredBrigadeData.length > 0) {
    brigadesShowingString = `${projects.length} projects from `;
    const firstFiveBrigades = filteredBrigadeData
      .map((b) => b.name)
      .slice(0, 5);
    if (selectedBrigade) {
      brigadesShowingString = `${brigadesShowingString} ${selectedBrigade.name}`;
    } else {
      brigadesShowingString = `${brigadesShowingString} ${firstFiveBrigades.join(
        ', '
      )}`;
    }
    if (filteredBrigadeData.length > 5) {
      brigadesShowingString = `${brigadesShowingString} and ${
        filteredBrigadeData.length - 5
      } other brigades`;
    }
  }

  return (
    <>
      {/* List projects by brigades that are shown on accompanying map */}
      {/* When map zooms or moves, re-filter geographically */}
      <h1>Projects by brigade or geographic area</h1>
      <p>{brigadesShowingString}</p>
      <div>
        Zoom in on the map to filter by projects in a geographic area or&nbsp;
        <Select
          label="select a brigade"
          id="select-brigade"
          emptyOptionText="All brigades"
          className="display-inline-block"
          options={(brigadeData || [])
            .filter((b) => !!b.latitude && !!b.longitude)
            .map((b) => b.name)}
          selected={
            filterOpts && selectedBrigade
              ? selectedBrigade.name
              : 'All brigades'
          }
          onChange={(event) => {
            if (!event || !event.target) return;
            const newVal = event.target.value;
            setFilterOpts(() => ({
              selectedBrigade: brigadeData.find((b) => b.name === newVal),
            }));
          }}
        />
      </div>
      <br />
      <div className="brigades-page-content">
        <Map
          brigadeData={brigadeData}
          filterOpts={filterOpts}
          setFilterOpts={setFilterOpts}
        />
        <ProjectsTable
          projects={projects}
          columns={columns}
          tableAttributes={tableAttributes}
        />
      </div>
    </>
  );
}

export default Brigades;
