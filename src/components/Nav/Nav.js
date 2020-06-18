import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';

function Nav() {
  return (
    <nav role="navigation" aria-label="Main">
      <ul>
        <li>
          <NavLink to="/projects">Projects</NavLink>
        </li>
        <li>
          <NavLink to="/brigades">Projects by Brigade</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
