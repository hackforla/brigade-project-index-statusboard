/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import Button from '../Button/Button';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import './MultiSelect.scss';
import { UnselectedTags } from './UnselectedTags';

function changeHandler(
  selectedItems,
  setSelectedItems,
  onSelectionItemsChange
) {
  return (selectedItem, downshift) => {
    if (!selectedItem) return;
    const i = selectedItems.findIndex((item) => item.id === selectedItem.id);
    if (i === -1) setSelectedItems([...selectedItems, selectedItem]);
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
  setSelectedItems,
  clearTaxonomy,
  ...rest
}) => (
  <>
    <Downshift
      {...rest}
      onChange={changeHandler(
        selectedItems,
        setSelectedItems,
        onSelectionItemsChange
      )}
    >
      {({
        getLabelProps,
        getInputProps,
        getItemProps,
        getToggleButtonProps,
        clearSelection,
        isOpen,
        selectedItem,
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
                  setSelectedItems([]);
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

          {/* {isOpen ? (
            <ul>
              {items
                .filter(
                  (item) =>
                    !selectedItems.find(
                      (selectedItem2) => selectedItem2 === item
                    ) && item.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((item) => (
                  <li
                    {...getItemProps({
                      item,
                      key: item,
                    })}
                  >
                    {'  '}
                    {item}
                  </li>
                ))}
            </ul>
          ) : null} */}
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
