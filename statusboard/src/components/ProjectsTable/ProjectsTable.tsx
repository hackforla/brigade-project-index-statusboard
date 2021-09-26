import { Row, useTable, TableOptions, PluginHook } from 'react-table';
import React, { useContext, useEffect } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import './SuperResponsiveTableStyle.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
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
        <Table {...getTableProps()}>
          <thead className="desktop">
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
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
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()} style={{paddingLeft:'0.5rem !important'}}>{cell.render('Cell')}</Td>
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
      </PerfectScrollbar>
    </div>
  );
}
