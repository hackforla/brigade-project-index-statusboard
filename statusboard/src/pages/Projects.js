import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ProjectsTable, TextFilter, fuzzyTextFilterFn } from '../components';
import {
  filterActiveProjects,
  getBaseApiUrl,
  getProjectsFromBrigadeData,
} from '../utils';
import TopicsFilter from '../components/ProjectsTable/TopicsFilter';

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
          // TODO: CHANGE THIS WHEN WE HAVE A PROJECT DETAIL PAGE TO GO TO
          // <NavLink to={`/projects/${slugify(project.slug)}`}>{project.name}</NavLink>
          <a href={project.code_url}>{project.name}</a>
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
        Header: 'Topics',
        accessor: (project) => (project.topics || []).join(', '),
        Filter: TopicsFilter,
        filter: 'includes',
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
      setBrigadeData(brigades.data);
    };
    getData();
  }, []);

  useEffect(() => {
    setProjects(filterActiveProjects(getProjectsFromBrigadeData(brigadeData)));
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
