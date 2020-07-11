import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav role="navigation" aria-label="Main">
      <ul className="navigation__desktop">
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
      <div className="navigation__mobile">
        <button
          className={`hamburger ${isOpen ? 'open' : 'closed'}`}
          type="button"
          onClick={() => setIsOpen((oldIsOpen) => !oldIsOpen)}
        >
          <span className="sr-only">{`${isOpen ? 'Close' : 'Open'} nav`}</span>
          <span />
          <span />
          <span />
        </button>
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
      </div>
    </nav>
  );
}

export default Nav;
