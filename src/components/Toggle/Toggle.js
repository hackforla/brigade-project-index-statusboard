import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';
import './Toggle.scss';

export default function Toggle({ label, id, onChange }) {
  return (
    <label className="switch" htmlFor={id}>
      <input type="checkbox" id={id} onChange={onChange} />
      <span className="slider round" />
    </label>
  );
}

Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
