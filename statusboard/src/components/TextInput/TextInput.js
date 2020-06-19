import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';

export default function TextInput({ label, id, onChange }) {
  return (
    <div className="form-control-container">
      <label htmlFor={id} className="form-label form-label--inline">
        <div>{label}</div>
      </label>
      <input id={id} onChange={onChange} className="form-control" />
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
