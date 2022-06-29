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
    <div className="form-control-container column-display-option">
      <input
        type="checkbox"
        {...column.getToggleHiddenProps()}
        id={id}
        content="x"
        // onChange={(e) => })
        className="form-control column-display-option"
      />
      <label htmlFor={id} className="form-label checkbox-label-adjustment">
        {header}
      </label>
    </div>
  );
}
