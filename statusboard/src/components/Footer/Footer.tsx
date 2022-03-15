import React from 'react';
import './Footer.scss';

const submitBugReport =
  'https://github.com/codeforamerica/brigade-project-index-statusboard/issues/new?assignees=&labels=&template=bug_report.md&title=';
const submitFeatureRequest =
  'https://github.com/codeforamerica/brigade-project-index-statusboard/issues/new?assignees=&labels=&template=feature_request.md&title=';
const githubRepository =
  'https://github.com/codeforamerica/brigade-project-index-statusboard';

export default function Footer(): JSX.Element {
  return (
    <footer className="App-footer">
      <p>
        Submit a <a href={submitBugReport}>bug report</a> or{' '}
        <a href={submitFeatureRequest}>feature request</a> to our GitHub{' '}
        <a href={githubRepository}>repository</a>
      </p>
    </footer>
  );
}
