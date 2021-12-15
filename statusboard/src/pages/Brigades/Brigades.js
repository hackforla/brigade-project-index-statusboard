import React, { useState, useEffect, useContext } from 'react';
import { usePagination, useSortBy } from 'react-table';
import Map from '../../components/Map/Map';
import {
  getProjectsFromBrigadeData,
  filterBrigades,
  customStringSort,
} from '../../utils/utils';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';
import { ProjectsTable, Select } from '../../components';
import './Brigades.scss';

function Brigades() {
  const { allBrigadeData, allProjects } = useContext(BrigadeDataContext);
  const [filteredBrigadeData, setFilteredBrigadeData] =
    useState(allBrigadeData);
  const [filterOpts, setFilterOpts] = useState({});
  const { selectedBrigade } = filterOpts; // also has bounds
  const [projects, setProjects] = useState(allProjects);

  const ProjectCell = (cell) => {
    const project = cell.row.original;
    return <a href={project.code_url}>{project.name}</a>;
  };

  const BrigadeCell = (cell) => {
    const project = cell.row.original;
    return (
      <a target="new" href={project.brigade.website}>
        {project.brigade.name}
      </a>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Project name',
        accessor: 'name',
        sortType: 'customStringSort',
        Cell: ProjectCell,
      },
      {
        Header: 'Description',
        accessor: 'description',
        sortType: 'customStringSort',
      },
      {
        Header: 'Brigade',
        accessor: 'brigade',
        sortType: 'customStringSort',
        Cell: BrigadeCell,
      },
    ],
    []
  );

  const sortTypes = {
    customStringSort,
  };

  useEffect(() => {
    const newlyFilteredBrigadeData = filterBrigades(allBrigadeData, filterOpts);
    setFilteredBrigadeData(newlyFilteredBrigadeData);
    setProjects(getProjectsFromBrigadeData(newlyFilteredBrigadeData));
  }, [allBrigadeData, filterOpts]);

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

  const options = {
    columns,
    data: projects || [],
    initialState: {
      pageIndex: 0,
      pageSize: 50,
      sortBy: [
        {
          id: 'name',
        },
      ],
    },
    sortTypes,
  };
  const plugins = [useSortBy, usePagination];

  return (
    <>
      {/* List projects by brigades that are shown on accompanying map */}
      {/* When map zooms or moves, re-filter geographically */}
      <h1>Projects by brigade or geographic area</h1>
      <p>{brigadesShowingString}</p>
      <div>
        Zoom in on the map to filter by projects in a geographic area or
        <Select
          label=" select a brigade "
          id="select-brigade"
          emptyOptionText="All brigades"
          className="display-inline"
          options={(allBrigadeData || [])
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
              selectedBrigade: allBrigadeData.find((b) => b.name === newVal),
            }));
          }}
        />
      </div>
      <br />
      <div className="brigades-page-content">
        <Map
          brigadeData={allBrigadeData}
          filterOpts={filterOpts}
          setFilterOpts={setFilterOpts}
        />
        <ProjectsTable options={options} plugins={plugins} />
      </div>
    </>
  );
}

export default Brigades;
