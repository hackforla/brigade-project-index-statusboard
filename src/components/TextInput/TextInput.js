import React from 'react';
import PropTypes from 'prop-types';
import './TextInput.scss';

export default function TextInput({ label, id, onChange }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} onChange={onChange} />
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
