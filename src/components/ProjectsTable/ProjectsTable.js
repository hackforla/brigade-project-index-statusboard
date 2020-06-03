import React from 'react';
import { NavLink } from 'react-router-dom';

export default function ProjectsTable({ projects }) {
  // This is an extremely rudimentary version of this component for the sake of getting something into existence
  // and being able to use it in the brigade view
  // We should probably use react-table
  console.log(projects[0]);
  return (
    <div className="projects-table">
      {projects.map((project, i) => {
        return (
          <div key={i}>
            <NavLink to={`/projects/${project.name}`}>{project.name}</NavLink>
          </div>
        );
      })}
    </div>
  );
}
