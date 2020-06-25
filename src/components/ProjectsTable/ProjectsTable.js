/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTable, usePagination, useSortBy } from 'react-table';
import cx from 'classnames';
import Button from '../Button/Button';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
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
        disableSortBy: true,
        // TODO: TEXT FILTER
      },
      {
        Header: 'Description',
        accessor: 'description',
        disableSortBy: true,
        // TODO: TEXT FILTER
      },
      {
        Header: 'Brigade',
        accessor: 'brigade.name',
        sortType: 'basic',
      },
    ],
    []
  );

  const tableAttributes = useTable(
    {
      columns,
      data: projects || [],
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
    setPageSize,
    state: { pageSize },
  } = tableAttributes;

  return (
    <div className="projects-table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                if (!column.canSort) {
                  return (
                    <th {...column.getHeaderProps()}>
                      {' '}
                      {column.render('Header')}
                    </th>
                  );
                }
                return (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <Button type="button" linkButton className="sort-button">
                      <div>
                        {column.render('Header')}
                        <Arrow
                          className={cx(
                            {
                              sorted: column.isSorted,
                              asc: !column.isSortedDesc,
                              desc: column.isSortedDesc,
                            },
                            'sort-arrow'
                          )}
                        />
                      </div>
                      <span className="sr-only">Toggle sort</span>
                      {column.isSorted && (
                        <span className="sr-only">
                          {column.isSortedDesc ? 'Descending' : 'Ascending'}
                        </span>
                      )}
                    </Button>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {!projects && <span>Loading...</span>}
          {projects && projects.length === 0 && <span>No projects</span>}
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
        </tbody>
      </table>
      {projects && pageSize < projects.length && (
        <div className="load-projects-button">
          <Button
            text="Load next 50 projects"
            onClick={() => setPageSize(pageSize + 50)}
          />
        </div>
      )}
    </div>
  );
}
