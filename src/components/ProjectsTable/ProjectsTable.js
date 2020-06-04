/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTable, usePagination } from 'react-table';
import { Button, Select, TextInput } from '..';
import './ProjectsTable.scss';

// Helpful examples
// https://github.com/tannerlinsley/react-table/blob/master/docs/examples/simple.md
// This is probably what we want
// github.com/tannerlinsley/react-table/blob/master/examples/sub-components/src/App.js

export default function ProjectsTable({ projects }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Project name',
        accessor: (project) => (
          <NavLink to={`/projects/${project.slug}`}>{project.name}</NavLink>
        ),
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Brigade',
        accessor: 'brigade.name',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: projects,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (
    <div className="projects-table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 
        TODO: this was copied from the example and the accessibility is a hot mess
      */}
      <div className="pagination">
        <div>
          <Button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            text="First"
          />
          <Button
            onClick={previousPage}
            disabled={!canPreviousPage}
            text="Previous"
          />

          <div>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </div>

          <Button onClick={nextPage} disabled={!canNextPage} text="Next" />
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            text="Last"
          />
        </div>
        <div>
          <TextInput
            label="Go to page"
            id="go-to-page"
            type="number"
            onChange={(e) => {
              const p = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(p);
            }}
          />
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            options={[10, 20, 30, 40, 50]}
            label="Projects per page"
          />
        </div>
      </div>
    </div>
  );
}
