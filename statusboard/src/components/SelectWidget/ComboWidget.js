/* eslint-disable jsx-a11y/control-has-associated-label */
import { React } from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import '../commonFormControlStyles.scss';

export default function ComboWidget({
  label,
  id,
  options,
  onChange,
  // selected,
  emptyOptionText = 'None',
  // className,
  // inline,
  // extraRef,
  // inputClassName = '',
}) {
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
        name="example"
        list="exampleList"
        className="form-control"
      :/>
      {/* <datalist id="exampleList">
        <option value="Red dog" />
        <option value="Dog red" />
        <option value="Cat" />
      </datalist> */}
      {/* <input type="text" name="elephant" list={id} /> */}
      <datalist
        id="exampleList"
        // ref={extraRef}
        onChange={onChange}
        className="form-control"
        // {`${cx('form-control', {
        //   'form-control--inline': inline,
        // })}
        //   ${inputClassName}`}
        // value={selected}
      >
        {emptyOptionText && (
          <option value={emptyOptionText}>{emptyOptionText}</option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </datalist>
    </div>
  );
}

ComboWidget.defaultProps = {
  // selected: undefined,
  options: [],
  // className: '',
  emptyOptionText: undefined,
  // inline: false,
};

ComboWidget.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  //     { value: String || undefined },
  //     { label: String || undefined },
  // }],
  onChange: PropTypes.func.isRequired,
  // selected: PropTypes.string,
  emptyOptionText: PropTypes.string,
  // className: PropTypes.string,
  // inline: PropTypes.bool,
};
