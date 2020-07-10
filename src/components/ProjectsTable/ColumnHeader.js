// TODO: DEAL WITH THESE
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import cx from 'classnames';
import Button from '../Button/Button';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import './ColumnHeader.scss';

export default function ColumnHeader({ column }) {
  const headerProps = column.getHeaderProps();
  let sortProps;
  if (column.canSort) {
    sortProps = column.getHeaderProps(column.getSortByToggleProps());
  }
  return (
    <th {...headerProps} className="column-header">
      <div className="column-header__contents">
        <div>{column.render('Header')}</div>
        {column.canFilter && <div>{column.render('Filter')}</div>}
        {column.canSort && (
          <div>
            <Button
              type="button"
              className="sort-button"
              onClick={sortProps ? sortProps.onClick : undefined}
            >
              <div>
                {column.isSorted ? (
                  <>
                    <Arrow
                      className={cx(
                        {
                          sorted: column.isSorted,
                          asc: !column.isSortedDesc,
                          desc: column.isSortedDesc,
                        },
                        'sort-arrow'
                      )}
                    />

                    <span className="sr-only">
                      {column.isSortedDesc ? 'Descending' : 'Ascending'}
                    </span>
                  </>
                ) : (
                  <>Sort</>
                )}
              </div>
            </Button>
          </div>
        )}
      </div>
    </th>
  );
}
