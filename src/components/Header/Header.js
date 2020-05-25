import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from './cfa-brigade-logo.svg';
import Nav from '../Nav/Nav';
import './Header.css';


function Header() {
  return (
    <header className="App-header">
      <NavLink to="/"><h1>
        <img
          src={logo}
          className="App-logo"
          alt="Code for America brigade program logo"
          role="presentation"
        />
        <span className="App-title">Brigade Project Index</span>
      </h1></NavLink>
      <Nav />
    </header>
  );
}

export default Header;
