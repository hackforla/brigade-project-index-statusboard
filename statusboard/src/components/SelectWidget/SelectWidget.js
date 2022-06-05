/* eslint-disable react/jsx-filename-extension */
import { React } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import '../commonFormControlStyles.scss';

export default function SelectWidget({
  label,
  id,
  options,
  onChange,
  selected,
  emptyOptionText,
  className,
  inline,
  extraRef,
  inputClassName,
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
      <select
        id={id}
        ref={extraRef}
        onChange={onChange}
        className={`${inputClassName} ${cx('form-control', {
          'form-control--inline': inline,
        })}
          `}
        value={selected}
      >
        {emptyOptionText && (
          <option value={emptyOptionText}>{emptyOptionText}</option>
        )}
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

SelectWidget.defaultProps = {
  selected: undefined,
  options: [],
  className: '',
  inputClassName: '',
  emptyOptionText: undefined,
  inline: false,
};

SelectWidget.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
  emptyOptionText: PropTypes.string,
  className: PropTypes.string,
  inline: PropTypes.bool,
  inputClassName: PropTypes.string,
};
