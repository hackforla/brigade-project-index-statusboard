import { Row, useTable, TableOptions, PluginHook } from 'react-table';
import React, { useContext, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import Button from '../Button/Button';
import ColumnHeader from './ColumnHeader';
import './ProjectsTable.scss';
import { Project } from '../../utils/types';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';


export type TableAttributes = {
  options: TableOptions<Project>;
  plugins?: PluginHook<Project>[];
  setRowCounter?: (value: React.SetStateAction<number>) => void;
};

export default function ProjectsTable({
  options,
  plugins = [],
  setRowCounter,
}: TableAttributes): JSX.Element {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    setPageSize,
    state: { pageSize },
  } = useTable<Project>(options, ...plugins);
  const { loading } = useContext(BrigadeDataContext);

  useEffect(() => {
    setRowCounter?.(rows.length);
  }, [rows, setRowCounter]);

  return (

    <div className="projects-table">
      <PerfectScrollbar>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <ColumnHeader
                    column={column}
                    key={column.id}
                    disableSort={!rows.length}
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading && (
              <tr>
                <td colSpan={3}>
                  <span>Loading...</span>
                </td>
              </tr>
            )}
            {!rows.length && !loading && (
              <tr>
                <td colSpan={3}>
                  <span>No projects</span>
                </td>
              </tr>
            )}
            {page.map((row: Row<Project>) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {pageSize < rows.length && (
          <div className="load-projects-button">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Button
              text="Load next 50 projects"
              onClick={() => setPageSize(pageSize + 50)}
            />
          </div>
        )}
      </PerfectScrollbar>
    </div>
  );
}
