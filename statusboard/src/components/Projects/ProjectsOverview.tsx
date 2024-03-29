/* eslint-disable react/style-prop-object */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/prefer-default-export */
import React from 'react';

// From https://www.axelerant.com/resources/team-blog/using-downshift-create-multi-select-widget-react
// eslint-disable @typescript-eslint/explicit-module-boundary-types
// eslint-disable import/prefer-default-export

export const ProjectsOverview = () => (
  <div>
    <div className="attention">
      Looking for an open source Civic Tech Github (and non Github) project?
    </div>
    <br />
    <div>
      Search our list of Civic Tech Open Source projects. Use as is, make
      request for changes, or change yourself! Many projects are looking for
      volunteers. Filter projects based on your area of interest and date last
      updated. Check out the{' '}
      <a href="https://brigade.cloud/" rel="noreferrer" target="_blank">
        Project Index Documentation
      </a>{' '}
      for information on adding your project, how to contribute, tag taxonomy,
      and more. Maintained by the{' '}
      <a
        href="https://brigade.codeforamerica.org"
        rel="noreferrer"
        target="_blank"
      >
        Brigade Network
      </a>{' '}
      of{' '}
      <a href="https://codeforamerica.org/" rel="noreferrer" target="_blank">
        Code for America
      </a>
      .
    </div>
  </div>
);
