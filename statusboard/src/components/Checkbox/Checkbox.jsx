/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '../commonFormControlStyles.scss';
import './Checkbox.scss';

export default function Checkbox({ label, id, onChange, defaultValue }) {
  return (
    <div className="form-control-container" style={{ display: 'flex' }}>
      <label htmlFor={id} className="form-label checkbox-label-adjustment">
        {label}
      </label>
      <input
        type="checkbox"
        id={id}
        onChange={onChange}
        className="form-control"
        defaultChecked={defaultValue === 'true'}
      />
    </div>
  );
}
