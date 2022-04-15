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
  selectedItems,
  setSelectedItem,
  setInputValue,
  inputValue,
  setIsOpen,
  isOpen,
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
        // parameters required by Downshift
        getLabelProps,
        getInputProps,
        getItemProps,
        getToggleButtonProps,
        clearSelection,
        selectedItem,
        isOpen,
        inputValue,
      }) => (
        <div className="multi-select">
          <div className="form-control-container">
            <label {...getLabelProps()}>{labelText}</label>
            <input {...getInputProps()} type="text" className="form-control" />
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
            {selectedItem || selectedItems.length > 0 ? (
              <Button
                className="button-primary clear-button"
                onClick={() => {
                  clearSelection();
                  clearTaxonomy();
                }}
                text="Clear"
              />
            ) : null}
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
  clearTaxonomy: PropTypes.func,
  isOpen: Boolean,
  selectedItem: {},
  inputValue: String,
};
