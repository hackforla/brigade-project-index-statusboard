/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import Button from '../../Button/Button';

function removeSelectedItemByIndex(i, selectedItems, setSelectedItems) {
  const temp = [...selectedItems];
  temp.splice(i, 1);
  setSelectedItems(temp);
}

export const Tags = ({ setSelectedItems, selectedItems = [] }) => (
  <div>
    {selectedItems.map((value, i) => (
      <span key={value}>
        <Button
          className="form-control--dark-background tag"
          onClick={() =>
            removeSelectedItemByIndex(i, selectedItems, setSelectedItems)
          }
        >
          <>
            <span className="sr-only">Remove</span>
            <span className="tag__name">{value}</span>
            <span className="tag__close">x</span>
          </>
        </Button>
      </span>
    ))}
  </div>
);