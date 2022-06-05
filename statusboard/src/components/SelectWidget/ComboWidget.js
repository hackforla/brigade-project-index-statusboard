/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { React } from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import '../commonFormControlStyles.scss';
import '../Projects/ProjectsTable/ProjectsQuery.scss';

export default function ComboWidget({
  label,
  id,
  options,
  onChange,
  inputClassName,
  defaultValue,
}) {
  const listId = `list${id}`;
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
        onChange={onChange}
        defaultValue={defaultValue}
      />
      <datalist
        id={listId}
        // ref={extraRef}
        className="form-control"
        // {`${cx('form-control', {
        //   'form-control--inline': inline,
        // })}
        //   ${inputClassName}`}
        // value={selected}
      >
        <option key="ALL" value=" " />
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  );
}

ComboWidget.defaultProps = {
  // selected: undefined,
  options: [],
  inputClassName: '',
  // inline: false,
};

ComboWidget.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  inputClassName: PropTypes.string,
};
