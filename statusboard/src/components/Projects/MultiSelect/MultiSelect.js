/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import Button from '../../Button/Button';
import { ReactComponent as Arrow } from '../../../assets/arrow.svg';
import './MultiSelect.scss';
import { UnselectedTags } from './UnselectedTags';

// TODO: remove
// function debugIt(...args) {
//   console.log(...args);
// }

function changeHandler({
  setSelectedItem,
  setInputValue,
  inputValue,
  setIsOpen,
  isOpen,
  selectedItems,
  setSelectedItems,
}) {
  return (selectedItem, downshift) => {
    console.log('debug input value', inputValue);
    setInputValue(inputValue);
    setIsOpen(isOpen);
    if (!selectedItem) return;
    setSelectedItem(selectedItem);
    // setInputValue(inputValue);
    // const i = selectedItems.findIndex((item) => item.id === selectedItem.id);
    setSelectedItems([...selectedItems, selectedItem]);
    downshift.clearSelection();
  };
}

// From https://www.axelerant.com/resources/team-blog/using-downshift-create-multi-select-widget-react
export const MultiSelect = ({
  availableTags,
  inputClassName = '',
  labelText,
  setSelectedItems,
  selectedItems = [],
  setSelectedItem,
  setIsOpen,
  isOpen,
  setInputValue,
  inputValue,
  clearTaxonomy,
  ...rest
}) => (
  <>
    <Downshift
      {...rest}
      onChange={changeHandler({
        selectedItems,
        setSelectedItem,
        setIsOpen,
        isOpen,
        setInputValue,
        inputValue,
        setSelectedItems,
      })}
    >
      {({
        // parameters provided by Downshift
        getLabelProps,
        getInputProps,
        getItemProps,
        getToggleButtonProps,
        isOpen,
        inputValue,
      }) => (
        <div className="multi-select">
          <div className="form-control-container">
            <label {...getLabelProps()}>{labelText}</label>
            <input
              {...getInputProps()}
              type="text"
              width="40px"
              className={`form-control ${inputClassName}`}
            />
            <Button
              {...getToggleButtonProps({
                className: 'button-primary form-control--right',
              })}
            >
              <>
                <Arrow className="dropdown-arrow" />
                <span className="sr-only">{isOpen ? 'close' : 'open'}</span>
              </>
            </Button>
          </div>
          <UnselectedTags
            availableTags={availableTags}
            selectedItems={selectedItems}
            getItemProps={getItemProps}
            isOpen={isOpen}
            inputValue={inputValue}
          />
        </div>
      )}
    </Downshift>
  </>
);

MultiSelect.defaultProps = {};

MultiSelect.propTypes = {
  availableTags: PropTypes.array,
  labelText: PropTypes.string,
  setSelectedItems: PropTypes.func,
  getItemProps: PropTypes.func,
  clearTaxonomy: PropTypes.func,
  isOpen: PropTypes.bool,
  selectedItem: {},
  inputValue: PropTypes.string,
};
