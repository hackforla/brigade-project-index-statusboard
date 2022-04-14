/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import './MultiSelect.scss';

// From https://www.axelerant.com/resources/team-blog/using-downshift-create-multi-select-widget-react
export const UnselectedTags = ({
  items,
  selectedItems = [],
  getItemProps,
  isOpen,
  inputValue,
}) => (
  <>
    <div>
      <div className="multi-select">
        {isOpen ? (
          <ul>
            {items
              .filter(
                (item) =>
                  !selectedItems.find(
                    (selectedItem) => selectedItem === item
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
        ) : null}
      </div>
    </div>
  </>
);

UnselectedTags.defaultProps = {};

UnselectedTags.propTypes = {
  items: PropTypes.array,
  selectedItems: PropTypes.array,
};
