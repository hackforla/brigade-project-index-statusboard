import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';
import './Button.scss';

export default function Button({ text, onClick, disabled, linkButton }) {
  // TODO: also make it possible to return link styled like a button

  return (
    <button
      className={`button ${linkButton ? ' link-button' : ' form-control'}`}
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
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  linkButton: PropTypes.bool,
};
