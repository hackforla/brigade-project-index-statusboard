/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';
import ClearInput from '../../pages/Projects/ClearInput';

export default function TextInput({
  label,
  id,
  onChange,
  onClear,
  defaultValue,
  inputClassName,
}) {
  return (
    <div className="text-input form-control-container">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        onChange={onChange}
        className={`${inputClassName} form-control`}
        defaultValue={defaultValue}
      />
      <ClearInput inputId={id} onClear={onClear} />
    </div>
  );
}

TextInput.defaultProps = {
  defaultValue: undefined,
  inputClassName: '',
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  inputClassName: PropTypes.string,
  defaultValue: PropTypes.string,
};
