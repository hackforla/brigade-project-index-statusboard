import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';

export default function TextInput({ label, id, onChange, defaultValue }) {
  return (
    <div className="form-control-container">
      <label htmlFor={id} className="form-label form-label--inline">
        <div>{label}</div>
      </label>
      <input
        id={id}
        onChange={onChange}
        className="form-control"
        defaultValue={defaultValue}
      />
    </div>
  );
}

TextInput.defaultProps = {
  defaultValue: undefined,
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};
