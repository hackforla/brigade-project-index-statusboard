import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';

import { render, screen } from '@testing-library/react';

import Projects from './Projects';
import { SAMPLE_BRIGADE } from '../utils/utils.test';

const fakeServer = setupServer(
  rest.get('/api/data.json', (req, res, ctx) => {
    return res(ctx.delay(), ctx.json([SAMPLE_BRIGADE]));
  })
);

// from: https://testing-library.com/docs/react-testing-library/example-intro
beforeAll(() => fakeServer.listen());
afterAll(() => fakeServer.close());
afterEach(() => fakeServer.resetHandlers());

describe('Page: <Projects>', () => {
  it('renders before and after projects have loaded', async () => {
    render(<Projects />);
    expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/311-index/)).toBeInTheDocument();
  });
});
