import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';

export default function Select({ label, id, options, onChange, selected }) {
  return (
    <div className="form-control-container">
      <label htmlFor={id} className="form-label form-label--inline">
        <div>{label}</div>
      </label>
      <select id={id} onChange={onChange} className="form-control">
        <option>Select</option>
        {options.map((option) => {
          return (
            <option key={option} selected={option === selected}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}

Select.defaultProps = {
  selected: undefined,
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
};
