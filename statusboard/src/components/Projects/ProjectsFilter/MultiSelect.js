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

function debugIt(...args) {
  console.log(...args);
}

function changeHandler(
  selectedItems,
  setSelectedItem,
  setInputValue,
  inputValue,
  onSelectionItemsChange
) {
  return (selectedItem, downshift) => {
    console.log('debug input value', inputValue);
    setInputValue(inputValue);
    if (!selectedItem) return;
    setSelectedItem(selectedItem);
    // setIsOpen(isOpen);
    // setInputValue(inputValue);
    // const i = selectedItems.findIndex((item) => item.id === selectedItem.id);
    onSelectionItemsChange([...selectedItems, selectedItem]);
    downshift.clearSelection();
  };
}

// From https://www.axelerant.com/resources/team-blog/using-downshift-create-multi-select-widget-react
export const MultiSelect = ({
  items,
  labelText,
  onSelectionItemsChange,
  selectedItems = [],
  setSelectedItem,
  isOpen,
  setInputValue,
  inputValue,
  clearTaxonomy,
  ...rest
}) => (
  <>
    <Downshift
      {...rest}
      onChange={changeHandler(
        selectedItems,
        setSelectedItem,
        // setIsOpen,
        // isOpen,
        setInputValue,
        inputValue,
        onSelectionItemsChange
      )}
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
          {debugIt('debug4 isOpen', selectedItem)}
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
            items={items}
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
  items: PropTypes.array,
  labelText: PropTypes.string,
  onSelectionItemsChange: PropTypes.func,
  clearTaxonomy: PropTypes.func,
  isOpen: Boolean,
  selectedItem: {},
  inputValue: String,
};
