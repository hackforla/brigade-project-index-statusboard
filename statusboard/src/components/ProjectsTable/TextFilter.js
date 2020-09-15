import React from 'react';
import matchSorter from 'match-sorter';
import { TextInput } from '..';

export function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, {
    keys: [
      (row) => {
        let rowText = row.values[id];
        if (rowText && rowText.props && rowText.props.children) {
          rowText = rowText.props.children;
        }
        return rowText;
      },
    ],
  });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// TODO: ADD PROPTYPES
// eslint-disable-next-line react/prop-types
export default function TextFilter({ column: { filterValue, setFilter, id } }) {
  return (
    <TextInput
      id={id}
      label="Filter"
      defaultValue={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    />
  );
}
