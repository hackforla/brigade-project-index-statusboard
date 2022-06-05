/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '../commonFormControlStyles.scss';
import './Checkbox.scss';

export default function Checkbox({ label, id, onChange }) {
  return (
    <div className="form-control-container" style={{ display: 'flex' }}>
      <label htmlFor={id} className="form-label checkboxLabelAdjustment">
        {label}
      </label>
      <input
        type="checkbox"
        id={id}
        onChange={onChange}
        className="form-control"
      />
    </div>
  );
}
