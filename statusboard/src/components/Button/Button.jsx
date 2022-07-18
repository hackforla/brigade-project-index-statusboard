/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';
import '../commonFormControlStyles.scss';
import './Button.scss';

export default function Button({
  text = '',
  onClick,
  disabled = false,
  linkButton = false,
  className = '',
  children = undefined,
  ...rest
}) {
  return (
    <button
      {...rest}
      className={cx('button', className, {
        'link-button': linkButton,
        'form-control': !linkButton,
      })}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      {children}
    </button>
  );
}
