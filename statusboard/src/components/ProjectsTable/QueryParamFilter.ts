import { FilterType, FilterValue, IdType, Row } from 'react-table';
import { Project } from '../../utils/types';

function returnFalse(): boolean {
  return false;
}

/**
 * A simple {@link FilterType} wrapper that updates the URL query parameters based on the column id and filter value.
 */
export default function queryParamFilter(
  filter: FilterType<Project>,
): FilterType<Project> {
  const myFilter: FilterType<Project> = (
    rows: Array<Row<Project>>,
    columnIds: Array<IdType<Project>>,
    filterValue: FilterValue,
  ): Array<Row<Project>> => {
    const queryParams = new URLSearchParams(window.location.search);

    if (typeof filterValue === 'string') {
      queryParams.set(columnIds[0], filterValue);
    } else if (filterValue === undefined) {
      // '' (e.g., empty filter field) is undefined
      queryParams.delete(columnIds[0]);
    }

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${queryParams.toString()}`,
    );
    // We need to manage autoRemove manually
    if (filter.autoRemove?.(filterValue)) {
      return rows;
    }
    return filter(rows, columnIds, filterValue);
  };

  // If we allow autoRemove we can't delete a query parameter
  myFilter.autoRemove = returnFalse;
  return myFilter;
}
