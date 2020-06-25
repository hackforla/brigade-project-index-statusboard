import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import '../commonFormControlStyles.scss';
import './Button.scss';

export default function Button({
  text,
  onClick,
  disabled,
  linkButton,
  className,
}) {
  return (
    <button
      className={cx('button', className, {
        'link-button': linkButton,
        'form-control': !linkButton,
      })}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  disabled: false,
  linkButton: false,
  className: '',
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  linkButton: PropTypes.bool,
  className: PropTypes.string,
};
