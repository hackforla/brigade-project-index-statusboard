// TODO: DEAL WITH THESE
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import cx from 'classnames';
import Button from '../../Button/Button';
import { ReactComponent as Arrow } from '../../../assets/arrow.svg';
import './ColumnHeader.scss';

export default function ColumnHeader({ column, disableSort }) {
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
              disabled={disableSort}
            >
              <>
                {column.isSorted && (
                  <span className="sr-only">
                    {column.isSortedDesc ? 'Descending' : 'Ascending'}
                  </span>
                )}
                <div className="sort-arrows">
                  <Arrow
                    className={cx('asc', 'sort-arrow', {
                      sorted: column.isSorted && !column.isSortedDesc,
                    })}
                  />
                  <Arrow
                    className={cx('desc', 'sort-arrow', {
                      sorted: column.isSortedDesc,
                    })}
                  />
                </div>
              </>
            </Button>
          </div>
        )}
      </div>
    </th>
  );
}
