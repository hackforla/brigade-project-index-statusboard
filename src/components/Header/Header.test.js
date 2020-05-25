import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Header from './Header';

test('renders Brigade Project Index header', () => {
  const { getByText } = render(<BrowserRouter><Header /></BrowserRouter>);
  const title = getByText(/Brigade Project Index/);
  expect(title).toBeInTheDocument();
});
test('renders the logo', () => {
  const { getByAltText } = render(<BrowserRouter><Header /></BrowserRouter>);
  const img = getByAltText(/Code for America brigade program logo/);
  expect(img).toBeInTheDocument();
});
test('logo has the presentation ARIA role', () => {
  const { getByRole } = render(<BrowserRouter><Header /></BrowserRouter>);
  const img = getByRole('presentation');
  expect(img).toBeInTheDocument();
});
