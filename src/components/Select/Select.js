import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';

export default function Select({
  label,
  id,
  options,
  onChange,
  selected,
  emptyOptionText,
}) {
  return (
    <div className="form-control-container">
      <label htmlFor={id} className="form-label form-label--inline">
        <div>{label}</div>
      </label>
      <select
        id={id}
        onChange={onChange}
        className="form-control"
        value={selected}
      >
        <option>{emptyOptionText}</option>
        {options.map((option) => {
          return <option key={option}>{option}</option>;
        })}
      </select>
    </div>
  );
}

Select.defaultProps = {
  selected: undefined,
  emptyOptionText: 'Select',
  options: [],
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
  emptyOptionText: PropTypes.string,
};
