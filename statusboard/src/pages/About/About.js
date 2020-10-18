import React from 'react';
import { aboutSections } from './aboutSections';

function About() {
  return (
    <div className="text-content">
      <h1>About</h1>
      <p>This is a front end for the Code for America Brigade Project Index.</p>
      <ul>
        {aboutSections.map((s) => (
          <li key={`hash-link-${s.id}`}>
            <a href={`#${s.id}`}>{s.title}</a>
          </li>
        ))}
      </ul>
      {aboutSections.map((s) => (
        <div key={`about-section-${s.id}`}>
          <h2 id={s.id}>{s.title}</h2>
          {s.content}
        </div>
      ))}{' '}
    </div>
  );
}

export default About;
