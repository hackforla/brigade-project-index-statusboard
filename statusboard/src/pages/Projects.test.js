import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import Projects from './Projects/Projects';
import { SAMPLE_BRIGADE } from '../utils/utils.test';
import { BrigadeDataContextProvider } from '../contexts/BrigadeDataContext';

const fakeServer = setupServer(
  rest.get('/api/data.json', (req, res, ctx) => {
    return res(ctx.delay(), ctx.json([SAMPLE_BRIGADE]));
  })
);

// from: https://testing-library.com/docs/react-testing-library/example-intro
beforeAll(() => fakeServer.listen());
afterAll(() => fakeServer.close());
afterEach(() => fakeServer.resetHandlers());

function RouteWithContext({ children, location }) {
  return (
    <BrigadeDataContextProvider>
      <StaticRouter location={location}>{children}</StaticRouter>
    </BrigadeDataContextProvider>
  );
}

describe('Page: <Projects>', () => {
  it('renders before and after projects have loaded', async () => {
    render(
      <RouteWithContext location="/projects?timeRange=all%20time">
        <Projects />
      </RouteWithContext>
    );
    expect(await screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/311-index/)).toBeInTheDocument();
  });
});
