import PropTypes from 'prop-types';
import React from 'react';

import Select from '../Select/Select';

export default function TopicFilter({ column: { setFilter, preFilteredRows } }) {
  const topicsByFrequency = {};

  preFilteredRows.forEach((row) => {
    const topics = (row.values.Topics || '').split(', ');
    if (topics.length === 1 && topics[0] === "") {
      return;
    }

    topics.forEach((topic) =>
      topicsByFrequency[topic] = (topicsByFrequency[topic] || 0) + 1
    )
  });

  const sortedTopics = Object.entries(topicsByFrequency)
    .sort((a, b) => b[1] - a[1])
    .map((topicAndCount) => topicAndCount[0]);

  return (
    <Select
      id="topic"
      label=""
      emptyOptionText=""
      options={sortedTopics}
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
