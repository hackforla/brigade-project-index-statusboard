import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer: <Footer />', () => {
  it('should contain a link to open a bug report', function () {
    const { getByText } = render(<Footer />);
    expect(getByText('bug report').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/codeforamerica/brigade-project-index-statusboard/issues/new?assignees=&labels=&template=bug_report.md&title='
    );
  });

  it('should contain a link to open a feature request', function () {
    const { getByText } = render(<Footer />);
    expect(getByText('feature request').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/codeforamerica/brigade-project-index-statusboard/issues/new?assignees=&labels=&template=feature_request.md&title='
    );
  });
});
