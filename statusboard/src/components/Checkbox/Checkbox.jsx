/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '../commonFormControlStyles.scss';
import './Checkbox.scss';

export default function Checkbox({ label, id, onChange, defaultValue }) {
  return (
    <div
      className="form-control-container checkbox"
      style={{ display: 'flex' }}
    >
      <label
        htmlFor={id}
        className="form-label checkbox checkbox-label-adjustment"
      >
        {label}
      </label>
      <input
        type="checkbox"
        id={id}
        onChange={onChange}
        className="form-control checkbox"
        defaultChecked={defaultValue === 'true'}
      />
    </div>
  );
}
