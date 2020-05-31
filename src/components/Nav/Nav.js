import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <nav role="navigation" aria-label="Main">
      <ul>
        <li>
          <NavLink to="/projects">Find a Project</NavLink>
        </li>
        <li>
          <NavLink to="/brigades">Find a Brigade</NavLink>
        </li>
        <li>
          <NavLink to="/about">Learn about the Brigade Program</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
