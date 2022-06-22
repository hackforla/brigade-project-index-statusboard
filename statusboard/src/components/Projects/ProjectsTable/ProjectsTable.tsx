/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-filename-extension */
import { Row, useTable, TableOptions, PluginHook } from 'react-table';
import React, { useContext, useEffect } from 'react';
// import 'react-perfect-scrollbar/dist/css/styles.css';
import { Table, Tbody, Tr, Td } from 'react-super-responsive-table';
import './SuperResponsiveTableStyle.css';
// import PerfectScrollbar from 'react-perfect-scrollbar';
import Button from '../../Button/Button';
import ColumnHeader from './ColumnHeader';
import './ProjectsTable.scss';
import { Project } from '../../../utils/types';
import BrigadeDataContext from '../../../contexts/BrigadeDataContext';
import ColumnDisplayOption from './ColumnDisplayOption';

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
    setHiddenColumns,
    getToggleHideAllColumnsProps,
    allColumns,
    state: { pageSize },
  } = useTable<Project>(options, ...plugins);
  const { loading } = useContext(BrigadeDataContext);

  useEffect(() => {
    setRowCounter?.(rows.length);
  }, [rows, setRowCounter]);

  return (
    <div className="projects-table">
      <div className="display-inline-flex">
        {allColumns.map((column) => (
          // <div key={`${headerGroup.getHeaderGroupProps().key}-b>`}>
          <ColumnDisplayOption
            column={column}
            key={`${column.id}-column-option`}
            id={column.id}
            // column={column}
            header={column.Header?.toString() || ''}
            setHiddenColumns={setHiddenColumns}
            getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
          />
          // </div>
        ))}
      </div>
      {/* <PerfectScrollbar> */}
      <Table {...getTableProps()}>
        <thead className="desktop">
          {headerGroups.map((headerGroup) => (
            <Tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.getHeaderGroupProps().key}
            >
              {headerGroup.headers.map((column) => (
                <ColumnHeader
                  column={column}
                  key={column.id}
                  disableSort={!rows.length}
                />
              ))}
            </Tr>
          ))}
        </thead>

        <Tbody {...getTableBodyProps()}>
          {loading && (
            <Tr>
              <Td colSpan={3}>
                <span>Loading...</span>
              </Td>
            </Tr>
          )}
          {!rows.length && !loading && (
            <Tr>
              <Td colSpan={3}>
                <span>No projects</span>
              </Td>
            </Tr>
          )}
          {page.map((row: Row<Project>) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={row.getRowProps().key}>
                {row.cells.map((cell) => (
                  <Td
                    {...cell.getCellProps()}
                    className={`${cell.column.id}-column`}
                    key={cell.getCellProps().key}
                  >
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
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
      {/* </PerfectScrollbar> */}
    </div>
  );
}
