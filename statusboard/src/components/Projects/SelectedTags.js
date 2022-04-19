/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import Button from '../Button/Button';

function removeSelectedItemByIndex(i, selectedItems, setSelectedItems) {
  const temp = [...selectedItems];
  temp.splice(i, 1);
  setSelectedItems(temp);
}

export const SelectedTags = ({
  setSelectedItems,
  selectedItems = [],
  clearTaxonomy,
}) => (
  <div>
    {selectedItems.length > 0 ? (
      <>
        <Button
          className="button-primary clear-button"
          onClick={() => {
            setSelectedItems([]);
            clearTaxonomy();
          }}
          text="Clear All"
        />{' '}
        {selectedItems.map((value, i) => (
          <span key={value}>
            <Button
              className="form-control--dark-background selected-tag"
              onClick={() =>
                removeSelectedItemByIndex(i, selectedItems, setSelectedItems)
              }
            >
              <>
                <span className="sr-only">Remove</span>
                <span className="selected-tag-name">{value}</span>
                <span className="selected-tag-close">x</span>
              </>
            </Button>{' '}
          </span>
        ))}
      </>
    ) : null}
  </div>
);
