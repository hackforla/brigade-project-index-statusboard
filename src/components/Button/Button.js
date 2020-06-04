import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';
import './Button.scss';

export default function Button({ text, onClick, disabled }) {
  // TODO: also make it possible to return link styled like a button
  return (
    <button
      className="button form-control"
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
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
