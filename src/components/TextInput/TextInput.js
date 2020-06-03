import React from 'react';
import './TextInput.scss';

export default function TextInput({ label, id, onChange }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} onChange={onChange} />
    </div>
  );
}
