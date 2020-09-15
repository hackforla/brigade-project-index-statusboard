import PropTypes from 'prop-types';
import React from 'react';

import Select from '../Select/Select';

export default function TopicFilter({ column: { setFilter, preFilteredRows } }) {
  const allTopics = new Set(
    preFilteredRows.flatMap((row) => (row.values.Topics || '').split(', '))
  );

  return (
    <Select
      id="topic"
      label=""
      emptyOptionText=""
      options={Array.from(allTopics).sort()}
      onChange={(e) => setFilter(e.target.value)}
    />
  );
}

TopicFilter.propTypes = {
  column: PropTypes.shape({
    setFilter: PropTypes.func,
    preFilteredRows: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
