import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import '../commonFormControlStyles.scss';

export default function Select({
  label,
  id,
  options,
  onChange,
  selected,
  emptyOptionText,
  className,
}) {
  return (
    <div className={cx('form-control-container', className)}>
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
  className: '',
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
  className: PropTypes.string,
};
