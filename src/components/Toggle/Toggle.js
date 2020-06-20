import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';
import './Toggle.scss';

export default function Toggle({ label, id, onChange }) {
  return (
    <div className="form-control-container">
      <label htmlFor={id} className="form-label form-label--inline">
        <div>{label}</div>
      </label>
      <div className="switch">
        <input type="checkbox" id={id} onChange={onChange} />
        <span className="slider round" />
      </div>
    </div>
  );
}

Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
