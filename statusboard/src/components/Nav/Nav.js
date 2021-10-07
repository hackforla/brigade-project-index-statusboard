import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((oldIsOpen) => !oldIsOpen);
  
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
          <a href="https://codeforamerica.github.io/publiccode-pusher/" className="external_link"  target='new' title="External Tool">PublicCode Editor</a>
        </li>
        <li>
          <a href="https://codeforamerica.github.io/civic-tech-taxonomy/editor-ui/" className="external_link" target='new' title="External Tool">Taxonomy</a>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
      <div className="navigation__mobile">
        <button
          className={`hamburger ${isOpen ? 'open' : 'closed'}`}
          type="button"
          onClick={toggleMenu}
        >
          <span className="sr-only">{`${isOpen ? 'Close' : 'Open'} menu`}</span>
          <div className="hamburger-bars">
            <span />
            <span />
            <span />
          </div>
        </button>
        <ul>
          <li>
            <NavLink onClick={toggleMenu} to="/projects">
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/brigades" onClick={toggleMenu}>
              Projects by Brigade
            </NavLink>
          </li>
          <li>
            <a href="https://codeforamerica.github.io/publiccode-pusher/" className='external_link'  target='new' title="External Tool">PublicCode Editor</a>
          </li>
          <li>
            <a href="https://codeforamerica.github.io/civic-tech-taxonomy/editor-ui/" className='external_link'  target='new' title="External Tool">Taxonomy</a>
          </li>
          <li>
            <NavLink to="/about" onClick={toggleMenu}>
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
