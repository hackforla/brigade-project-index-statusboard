/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTable, usePagination, useSortBy } from 'react-table';
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
      initialState: { pageIndex: 0 },
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
    rows,
  } = tableAttributes;

  return (
    <div className="projects-table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.slice(0, 10).map((row) => {
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
    </div>
  );
}
