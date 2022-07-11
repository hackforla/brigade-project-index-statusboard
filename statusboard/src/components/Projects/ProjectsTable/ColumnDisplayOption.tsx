/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-filename-extension */
// TODO: DEAL WITH THESE
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import './ColumnHeader.scss';

export default function ColumnDisplayOption({
  column,
  id,
  header,
}: {
  column: any;
  id: string;
  header: string;
  setHiddenColumns: (ids: string[]) => void;
  getToggleHideAllColumnsProps: any;
}): JSX.Element {
  return (
    <div className="column-display-option">
      <input
        type="checkbox"
        {...column.getToggleHiddenProps()}
        id={id}
      // onChange={(e) => })
      />
      <label htmlFor={id}>
        {header}
      </label>
    </div>
  );
}
