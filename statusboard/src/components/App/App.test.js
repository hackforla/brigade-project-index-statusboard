import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Brigade Project Index header', () => {
  render(<App />);
  const title = screen.getByText(/^Project Index$/i);
  expect(title).toBeInTheDocument();
});
