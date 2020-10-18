import React from 'react';
import cx from 'classnames';
import { Button, TextFilter } from '../../components';

export const getTableColumns = (filterTopics = [], setFilterTopics) => [
  {
    Header: 'Project',
    accessor: (project) => (
      // TODO: CHANGE THIS WHEN WE HAVE A PROJECT DETAIL PAGE TO GO TO
      // <NavLink to={`/projects/${slugify(project.slug)}`}>{project.name}</NavLink>
      <a href={project.code_url}>{project.name}</a>
    ),
    Filter: TextFilter,
    filter: 'fuzzyTextFilter',
  },
  {
    Header: 'Description',
    accessor: 'description',
    Filter: TextFilter,
    filter: 'fuzzyTextFilter',
  },
  {
    Header: 'Topics',
    accessor: (project) =>
      (project.topics || []).map((t) => (
        <Button
          className={cx('tag-link', {
            'tag-link--active': filterTopics.includes(t),
          })}
          key={`${project.name}-${t}`}
          linkButton
          text={t}
          onClick={() => setFilterTopics([t])}
        />
      )),
    disableFilters: true,
  },
  {
    Header: 'Brigade',
    accessor: 'brigade.name',
    Filter: TextFilter,
    filter: 'fuzzyTextFilter',
  },
];

export const ACTIVE_THRESHOLDS = {
  // key: user-facing string that represents the threshold
  // value: array of values for `last_pushed_within` that match the threshold
  'all time': ['month', 'week', 'year', 'over_a_year'],
  year: ['month', 'week', 'year'],
  month: ['month', 'week'],
  week: ['week'],
};
