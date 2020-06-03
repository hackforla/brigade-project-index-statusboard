import React from 'react';
import PropTypes from 'prop-types';
import './Select.scss';

export default function Select({ label, id, options, onChange }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} onChange={onChange}>
        {options.map((option) => {
          return <option key={option}>{option}</option>;
        })}
      </select>
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
