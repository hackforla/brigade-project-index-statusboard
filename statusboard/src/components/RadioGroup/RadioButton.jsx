import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';

export default function RadioButton({ value, label, id, onChange, selected }) {
  return (
    <div className="form-control-container">
      <input
        type="radio"
        key={value}
        selected={selected}
        className="form-control"
        onChange={onChange}
      />
      <label htmlFor={id} className="form-label form-label--inline">
        <div>{label || value}</div>
      </label>
    </div>
  );
}

RadioButton.defaultProps = {
  selected: false,
  label: undefined,
};

RadioButton.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string || PropTypes.element,
  selected: PropTypes.bool,
};
