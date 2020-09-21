// TODO: DEAL WITH ALL OF THESE
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import Button from '../Button/Button';
import ColumnHeader from './ColumnHeader';
import './ProjectsTable.scss';

export default function ProjectsTable({ projects, tableAttributes }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
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
              {headerGroup.headers.map((column) => (
                <ColumnHeader
                  column={column}
                  key={column.id}
                  disableSort={!projects || projects.length === 0}
                />
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {!projects && (
            <tr>
              <td colSpan="3">
                <span>Loading...</span>
              </td>
            </tr>
          )}
          {projects && projects.length === 0 && (
            <tr>
              <td colSpan="3">
                <span>No projects</span>
              </td>
            </tr>
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
        </tbody>
      </table>
      {projects && pageSize < rows.length && (
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
