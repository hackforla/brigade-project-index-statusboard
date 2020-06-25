import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  cleanBrigadeData,
  getProjectsFromBrigadeData,
  getBaseApiUrl,
} from '../utils';
import ProjectsTable from '../components/ProjectsTable/ProjectsTable';

function Projects() {
  const [brigadeData, setBrigadeData] = useState();
  const [projects, setProjects] = useState();

  const columns = React.useMemo(
    () => [
      {
        Header: 'Project',
        accessor: (project) => (
          <NavLink to={`/projects/${project.slug}`}>{project.name}</NavLink>
        ),
        disableSortBy: true,
        // TODO: TEXT FILTER
      },
      {
        Header: 'Live site',
        accessor: (project) => (
          <a href={project.link_url} rel="noopener noreferrer" target="_blank">
            {project.link_url}
          </a>
        ),
        disableSortBy: true,
        // TODO: TEXT FILTER
      },
      {
        Header: 'Code link',
        accessor: (project) => (
          <a href={project.code_url} rel="noopener noreferrer" target="_blank">
            {project.code_url}
          </a>
        ),
        disableSortBy: true,
        // TODO: TEXT FILTER
      },
      {
        Header: 'Description',
        accessor: 'description',
        disableSortBy: true,
        // TODO: TEXT FILTER
      },
      {
        Header: 'Brigade',
        accessor: 'brigade.name',
        sortType: 'basic',
      },
    ],
    []
  );

  const tableAttributes = useTable(
    {
      columns,
      data: projects || [],
      initialState: { pageIndex: 0, pageSize: projects ? projects.length : 50 },
    },
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
      <h2>All projects</h2>
      {/* This is just a stand-in-- we should probably make it so that we can pass column props to the table */}
      <ProjectsTable projects={projects} tableAttributes={tableAttributes} />
    </>
  );
}

export default Projects;
