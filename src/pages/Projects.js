import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  cleanBrigadeData,
  getProjectsFromBrigadeData,
  getBaseApiUrl,
} from '../utils';
import ProjectsTable from '../components/ProjectsTable/ProjectsTable';

function Projects() {
  const [brigadeData, setBrigadeData] = useState();
  const projects = getProjectsFromBrigadeData(brigadeData);

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      setBrigadeData(cleanBrigadeData(brigades));
    };
    getData();
  }, []);

  return (
    <>
      <h2>Projects page!</h2>
      {/* This is just a stand-in-- we should probably make it so that we can pass column props to the table */}
      <ProjectsTable projects={projects} />
    </>
  );
}

export default Projects;
