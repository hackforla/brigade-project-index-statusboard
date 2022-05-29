/* eslint-disable import/prefer-default-export */
import matchSorter from 'match-sorter';

export function fuzzyTextFilter(rows, filterAttribute, filterValue) {
  const trimmedFilterValue = filterValue?.trim();
  return matchSorter(rows, trimmedFilterValue, filterAttribute, filterValue);
}
