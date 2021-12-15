import React from 'react';
import cx from 'classnames';
import '../commonFormControlStyles.scss';
import './Checkbox.scss';

export default function Checkbox({
  label,
  id,
  onChange,
  className = '',
  inline = true
}) {
  return (
    <div
      className={cx(
        'form-control-container',
        { 'form-control-container--inline': inline },
        className
      )}
      style={{ display: 'flex' }}
    >
      <label
        htmlFor={id}
        className={cx('form-label', { 'form-label--inline': inline })}
      >
        {label}
      </label>
      <input
	    type="checkbox"
        id={id}
        onChange={onChange}
        className={cx('form-control', { 'form-control--inline': inline })}
      />
    </div>
  );
}

