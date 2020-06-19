import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from './cfa-brigade-logo.svg';
import Nav from '../Nav/Nav';
import './Header.scss';

function Header() {
  // According to Deque it's a best practice to start the content with h1 rather than use it in the header
  // https://dequeuniversity.com/assets/html/jquery-summit/html5/slides/headings.html
  return (
    <header className="App-header">
      <NavLink to="/" className="home-link">
        <img
          src={logo}
          className="App-logo"
          alt="Code for America brigade"
          role="presentation"
        />
        <span className="App-title">Project Index</span>
      </NavLink>
      <Nav />
    </header>
  );
}

export default Header;
