import React from 'react';
import cx from 'classnames';
import '../commonFormControlStyles.scss';

export default function Checkbox({
  label,
  id,
  onChange,
  className,
  inline,
}) {
  return (
    <div
      className={cx(
        'form-control-container',
        { 'form-control-container--inline': inline },
        className
      )}
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

