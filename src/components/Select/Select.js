import React from 'react';
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
