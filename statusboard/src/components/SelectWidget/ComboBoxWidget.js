/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { React } from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import '../commonFormControlStyles.scss';
import '../Projects/ProjectsTable/ProjectsQuery.scss';

function changeIfValidValue(options, e, onChange) {
  if (options.includes(e.target.value) || e.target.value.trim() === '') {
    onChange(e);
  }
}

function resetIfNotValidValue(options, e, originalValue) {
  const validValue =
    options.includes(e.target.value) || e.target.value.trim() === '';
  if (!validValue) {
    e.target.value = originalValue;
  }
}

function selectOnFocus(e) {
  e.target.select();
}

export default function ComboBoxWidget({
  label,
  id,
  options,
  onChange,
  inputClassName,
  defaultValue,
}) {
  const listId = `list${id}`;
  let originalValue = '';
  return (
    <div
      className="form-control-container"
      // className={cx(
      //   'form-control-container',
      //   { 'form-control-container--inline': inline },
      //   className
      // )}
    >
      <label
        htmlFor={id}
        className="form-label"
        // className={cx('form-label', { 'form-label--inline': inline })}
      >
        {label}
      </label>
      <input
        type="text"
        name={id}
        list={listId}
        className={`${inputClassName} form-control`}
        onFocus={(e) => {
          originalValue = e.target.value;
          selectOnFocus(e);
        }}
        onChange={(e) => {
          changeIfValidValue(options, e, onChange);
        }}
        onBlur={(e) => {
          resetIfNotValidValue(options, e, originalValue);
        }}
        defaultValue={defaultValue}
      />
      <datalist id={listId}>
        <option key="ALL" value=" " />
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  );
}

ComboBoxWidget.defaultProps = {
  // selected: undefined,
  options: [],
  inputClassName: '',
  defaultValue: '',
  // inline: false,
};

ComboBoxWidget.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  inputClassName: PropTypes.string,
  defaultValue: PropTypes.string,
};
