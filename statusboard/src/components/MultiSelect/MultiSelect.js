import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import Button from '../Button/Button';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import './MultiSelect.scss';

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
            <input
              {...getInputProps()}
              type="text"
              className="form-control"
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

          {isOpen ? (
            <ul>
              {items
                .filter(
                  (item) =>
                    !selectedItems.find(
                      (selectedItem) => selectedItem === item
                    ) && item.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((item) => {
                  return (
                    <li
                      {...getItemProps({
                        item,
                        key: item,
                      })}
                    >
                      {' '}
                      {item}{' '}
                    </li>
                  );
                })}
            </ul>
          ) : null}

          <div>
            {selectedItems.map((value, i) => {
              return (
                <span key={value}>
                  <Button
                    className="form-control--dark-background tag"
                    onClick={() =>
                      removeSelectedItemByIndex(
                        i,
                        selectedItems,
                        setSelectedItems,
                        onSelectionItemsChange
                      )
                    }
                  >
                    <>
                      <span className="sr-only">Remove</span>
                      <span className="tag__name">{value}</span>
                      <span className="tag__close">x</span>
                    </>
                  </Button>{' '}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </Downshift>
  </>
);

/* Helper functions */
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

function removeSelectedItemByIndex(
  i,
  selectedItems,
  setSelectedItems,
  onSelectionItemsChange
) {
  const temp = [...selectedItems];
  temp.splice(i, 1);
  setSelectedItems(temp);
  onSelectionItemsChange(temp);
}

MultiSelect.defaultProps = {};

MultiSelect.propTypes = {
  items: PropTypes.array,
  labelText: PropTypes.string,
  onSelectionItemsChange: PropTypes.func,
  clearTaxonomy: PropTypes.func,
};
