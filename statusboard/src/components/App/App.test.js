import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Brigade Project Index header', () => {
  const { getByText } = render(<App />);
  const title = getByText(/Brigade Project Index/i);
  expect(title).toBeInTheDocument();
});
