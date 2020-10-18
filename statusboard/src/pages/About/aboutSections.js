import React from 'react';

const resources = {
  cfa: {
    name: 'Code for America',
    link: 'https://www.codeforamerica.org/',
  },
  brigades: {
    name: 'Code for America brigade network',
    link: 'https://brigade.codeforamerica.org',
  },
  slack: {
    name: 'Code for America Slack',
    link: 'http://slack.codeforamerica.org',
  },
  thisGitHub: {
    name: 'GitHub repository for this site',
    link: 'https://github.com/codeforamerica/brigade-project-index-statusboard',
  },
  indexGitHub: {
    name: 'GitHub repository for the Project Index',
    link: 'https://github.com/codeforamerica/brigade-project-index',
  },
  indexDocs: {
    name: 'Brigade Project Index documentation',
    link: 'https://brigade.cloud/',
  },
};

function getResourceLink(whichResource) {
  return (
    <a href={resources[whichResource].link}>{resources[whichResource].name}</a>
  );
}

export const aboutSections = [
  {
    id: 'index',
    title: 'About the index',
    content: (
      <>
        <p>
          The Brigade Project Index provides the data for this application.
          Learn more about the index by checking out the{' '}
          {getResourceLink('indexDocs')} or the {getResourceLink('indexGitHub')}
          .
        </p>
      </>
    ),
  },
  {
    id: 'add',
    title: 'Add projects',
    content: (
      <>
        <p>
          Are your brigade's projects not showing up here? Check out the{' '}
          {getResourceLink('indexDocs')} to learn how to include your brigade's
          project list.
        </p>
        <p>
          Are your brigade's projects showing up, but not all of them? Make sure
          the projects you're not seeing are represented in whatever your
          brigade's source of truth is (see above-- GitHub organization, CSV,
          etc).
        </p>
        <p>
          If you need help with these steps, please get in touch with us on{' '}
          {getResourceLink('slack')}. If you have tried these steps and need to
          file a bug report, please open an issue on the{' '}
          {getResourceLink('thisGitHub')}. Please include as much detail as
          possible.
        </p>
      </>
    ),
  },
  {
    id: 'contribute',
    title: 'Contribute to this website',
    content: (
      <>
        <p>
          This application is mostly maintained by {getResourceLink('brigades')}{' '}
          volunteers, with support from {getResourceLink('cfa')}. We would
          welcome contributions of code, ideas, designs, and bug reports.
        </p>
        <p>
          The front end is written in React and the API is a Node app. You can
          find the code on the {getResourceLink('thisGitHub')} and fork the
          project to start working on it. We communicate on the{' '}
          {getResourceLink('slack')}, using the #brigade-project-index channel.
        </p>
      </>
    ),
  },
  {
    id: 'resources',
    title: 'Resources',
    content: (
      <ul>
        {Object.keys(resources).map((key) => (
          <li key={key}>{getResourceLink(key)}</li>
        ))}
      </ul>
    ),
  },
];
