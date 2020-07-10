import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import {
  cleanBrigadeData,
  getProjectsFromBrigadeData,
  getBaseApiUrl,
} from '../utils';
import { ProjectsTable, TextFilter, fuzzyTextFilterFn } from '../components';

function Projects() {
  const [brigadeData, setBrigadeData] = useState();
  const [projects, setProjects] = useState();

  // eslint-disable-next-line import/prefer-default-export
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
    }),
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Project',
        accessor: (project) => (
          <NavLink to={`/projects/${project.slug}`}>{project.name}</NavLink>
        ),
        Filter: TextFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Description',
        accessor: 'description',
        Filter: TextFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Brigade',
        accessor: 'brigade.name',
        Filter: TextFilter,
        filter: 'fuzzyText',
      },
    ],
    []
  );

  const tableAttributes = useTable(
    {
      columns,
      data: projects || [],
      initialState: {
        pageIndex: 0,
        pageSize: projects ? projects.length : 50,
      },
      filterTypes,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      setBrigadeData(cleanBrigadeData(brigades));
    };
    getData();
  }, []);

  useEffect(() => {
    setProjects(getProjectsFromBrigadeData(brigadeData, {}));
  }, [brigadeData]);

  return (
    <>
      <h1>All projects</h1>
      {/* This is just a stand-in-- we should probably make it so that we can pass column props to the table */}
      <ProjectsTable projects={projects} tableAttributes={tableAttributes} />
    </>
  );
}

export default Projects;
