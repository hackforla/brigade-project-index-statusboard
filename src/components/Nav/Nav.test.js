import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Nav from './Nav';

test('renders the nav bar', () => {
  const { getByRole } = render(
    <BrowserRouter>
      <Nav />
    </BrowserRouter>
  );
  const nav = getByRole('navigation');
  expect(nav).toBeInTheDocument();
});
