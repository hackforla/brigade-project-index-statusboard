/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  // eslint-disable-next-line max-len
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useBlockLayout,
  useGlobalFilter,
  useResizeColumns,
  useColumnOrder,
} from 'react-table';
import GlobalFiltering from './GlobalFiltering';
import {
  ColumnVisibilityCheckboxes,
  ResizeBar,
  TD,
  TH,
  TableBody,
} from './TableStyledComponents';

// eslint-disable-next-line max-len
const itemStyle = (
  { isDragging, isDropAnimating }: { isDragging: any; isDropAnimating: any },
  draggableStyle: any,
) => ({
  ...draggableStyle, // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  color: isDragging ? 'red' : '', // change background colour if dragging

  ...(!isDragging && { transform: 'translate(0,0)' }),
  ...(isDropAnimating && { transitionDuration: '0.25s' }),
});

function Table({ columns, data }: { columns: any; data: any }) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 200,
      maxWidth: 600,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder,
    state,
    setGlobalFilter,
    allColumns,
  } = useTable(
    { columns, data, defaultColumn },
    useColumnOrder,
    useFilters,
    useGroupBy,
    useGlobalFilter,
    useSortBy,
    useBlockLayout,
    useResizeColumns,
  );
  const { globalFilter } = state;
  const currentColOrder = React.useRef<any>();
  return (
    <>
      {/* Global filtering */}
      <GlobalFiltering filter={globalFilter} setFilter={setGlobalFilter} />
      {/* Hide/Show checkboxes */}
      <ColumnVisibilityCheckboxes>
        {allColumns.map((column) => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />
              {column.Header}
            </label>
          </div>
        ))}
      </ColumnVisibilityCheckboxes>
      {/* Table component */}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <DragDropContext
              onDragStart={() => {
                currentColOrder.current = allColumns?.map((o: any) => o.id);
              }}
              onDragUpdate={(dragUpdateObj: any) => {
                const colOrder = [...currentColOrder.current];
                const sIndex = dragUpdateObj.source.index;
                const dIndex = dragUpdateObj.destination && dragUpdateObj.destination.index;

                if (typeof sIndex === 'number' && typeof dIndex === 'number') {
                  colOrder.splice(sIndex, 1);
                  colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                  setColumnOrder(colOrder);
                }
              }}
              onDragEnd={() => null}
            >
              <Droppable droppableId="droppable" direction="horizontal">
                {(droppableProvided) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    ref={droppableProvided.innerRef}
                  >
                    {headerGroup.headers.map((column, index) => {
                      return (
                        <Draggable
                          key={column.id}
                          draggableId={column.id}
                          index={index}
                        // isDragDisabled={column?.accessor}
                        >
                          {(provided, snapshot) => (
                            <TH
                              {...column.getHeaderProps()}
                              className="cell header"
                            >
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // {...extraProps}
                                ref={provided.innerRef}
                                style={{
                                  ...itemStyle(
                                    snapshot,
                                    provided.draggableProps.style,
                                  ),
                                }}
                              >
                                <span
                                  {...column.getHeaderProps(
                                    column.getSortByToggleProps(),
                                  )}
                                  style={{
                                    display: 'inline',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <span>
                                    {
                                      // eslint-disable-next-line no-nested-ternary
                                      column.isSorted ? (
                                        column.isSortedDesc ? (
                                          <span
                                            style={{
                                              color: 'rgba(20,20,20,0.75)',
                                            }}
                                          >
                                            {'⬆  '}
                                          </span>
                                        ) : (
                                          <span
                                            style={{
                                              color: 'rgba(20,20,20,0.75)',
                                            }}
                                          >
                                            {'⬇  '}
                                          </span>
                                        )
                                      ) : (
                                        ''
                                      )
                                    }
                                  </span>
                                  {column.render('Header')}
                                </span>
                              </div>
                              <ResizeBar {...column.getResizerProps()} />
                            </TH>
                          )}
                        </Draggable>
                      );
                    })}
                  </tr>
                )}
              </Droppable>
            </DragDropContext>
          ))}
        </thead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell) => (
                  <TD {...cell.getCellProps()}>{cell.render('Cell')}</TD>
                ))}
              </tr>
            );
          })}
        </TableBody>
      </table>
    </>
  );
}

export default Table;
