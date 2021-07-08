import { FilterType, FilterValue, IdType, Row } from 'react-table';
import { Project } from '../../utils/types';

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
      myFilter.autoRemove = () => false; // If we autoRemove we can't delete a query
    } else if (filterValue === undefined) {
      // '' (e.g., empty filter field) is undefined
      queryParams.delete(columnIds[0]);
      // We have already deleted the query, so we enable the default autoRemove again
      myFilter.autoRemove = filter.autoRemove ?? myFilter.autoRemove;
    }

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${queryParams.toString()}`,
    );
    return filter(rows, columnIds, filterValue);
  };
  return myFilter;
}
