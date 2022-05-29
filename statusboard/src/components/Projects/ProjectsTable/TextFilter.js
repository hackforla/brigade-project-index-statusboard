/* eslint-disable import/prefer-default-export */
import matchSorter from 'match-sorter';

export function fuzzyTextFilter(rows, filterValue, filterAttribute) {
  const trimmedFilterValue = filterValue?.trim();
  return matchSorter(rows, trimmedFilterValue, { keys: [filterAttribute] });
}
