/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTable, usePagination, useSortBy } from 'react-table';
import Button from '../Button/Button';
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
        // TODO: TEXT FILTER
        // TODO: width doesn't seem to be working, and the table adjusts width in weird ways between pages
        width: 100,
        sortType: 'basic',
      },
      {
        Header: 'Description',
        accessor: 'description',
        // TODO: TEXT FILTER
      },
      {
        Header: 'Brigade',
        accessor: 'brigade.name',
        sortType: 'basic',

        // TODO: DROPDOWN FILTER
      },
    ],
    []
  );

  const tableAttributes = useTable(
    {
      columns,
      data: projects,
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    // TODO: use pagination to not load all of the rows every time
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
  } = tableAttributes;

  return (
    <div className="projects-table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Button
                    type="button"
                    aria-label={column.isSortedDesc ? 'Desc.' : 'Asc.'}
                    linkButton
                  >
                    {column.render('Header')}
                    <span className="sr-only">Toggle sort</span>
                    {column.isSorted && (
                      // TODO: REAL ICON HERE
                      // TODO: MAKE THIS A BUTTON
                      <span className="sr-only">
                        {column.isSortedDesc ? 'Descending' : 'Ascending'}
                      </span>
                    )}
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {canPreviousPage && (
            <Button text="Load previous 50 projects" onClick={previousPage} />
          )}
          {page.map((row) => {
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
          {canNextPage && (
            <Button text="Load next 50 projects" onClick={nextPage} />
          )}
        </tbody>
      </table>
    </div>
  );
}
