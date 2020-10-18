import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import Button from '../Button/Button';

// From https://www.axelerant.com/resources/team-blog/using-downshift-create-multi-select-widget-react
export const MultiSelect = ({
  items,
  labelText,
  onSelectionItemsChange,
  ...rest
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
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
          getMenuProps,
          getItemProps,
          getToggleButtonProps,
          clearSelection,
          highlightedIndex,
          isOpen,
          selectedItem,
          inputValue,
        }) => {
          return (
            <div>
              <label {...getLabelProps()}>{labelText}</label>

              <input {...getInputProps()} type="text" />

              <Button
                {...getToggleButtonProps({
                  className: 'button-primary',
                })}
              >
                {isOpen ? 'close' : 'open'}
              </Button>

              {selectedItem || selectedItems.length > 0 ? (
                <Button
                  className="button-primary"
                  onClick={() => {
                    setSelectedItems([]);
                    clearSelection();
                  }}
                  text="X"
                >
                  <span className="sr-only">Clear</span>
                </Button>
              ) : null}

              {isOpen
                ? items
                    .filter(
                      (item) =>
                        !selectedItems.find(
                          (selectedItem) => selectedItem === item
                        ) && item.includes(inputValue)
                    )
                    .map((item, index) => {
                      return (
                        <li
                          {...getItemProps({
                            item,
                            key: item,
                            style: {
                              backgroundColor:
                                index === highlightedIndex ? 'lightgray' : null,
                            },
                          })}
                        >
                          {' '}
                          {item}{' '}
                        </li>
                      );
                    })
                : null}

              <div>
                {selectedItems.map((value, i) => {
                  return (
                    <span key={value.id}>
                      <Button
                        onClick={() =>
                          removeSelectedItemByIndex(
                            i,
                            selectedItems,
                            setSelectedItems,
                            onSelectionItemsChange
                          )
                        }
                      >
                        {value.value}
                        {'  '}X{' '}
                      </Button>{' '}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        }}
      </Downshift>

      <hr />

      <pre>
        <strong>Downshift selectedItems state :</strong>
        <br /> {JSON.stringify(selectedItems)}
      </pre>
    </>
  );
};

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
};
