/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

export default function GlobalFiltering({
  filter,
  setFilter,
}: {
  filter: any;
  setFilter: any;
}) {
  return (
    <span style={{ margin: '1rem' }}>
      Search:{' '}
      <input
        style={{ padding: '0.25rem' }}
        value={filter || ''}
        onChange={(e) => setFilter(e.target.value)}
      />
    </span>
  );
}
