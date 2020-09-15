import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';
import RadioButton from './RadioButton';

export default function RadioGroup({ options, onChange, selected, id }) {
  return (
    <div className="form-control-container">
      {options.map((option) => {
        return (
          <RadioButton
            key={option}
            selected={option === selected}
            value={option}
            onChange={onChange}
            id={`${id}-${option}`}
          />
        );
      })}
    </div>
  );
}

RadioGroup.defaultProps = {
  selected: undefined,
};

const radioButtonProp = PropTypes.shape({});

RadioGroup.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string || radioButtonProp).isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
};
