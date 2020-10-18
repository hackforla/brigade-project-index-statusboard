import React, { useState, useEffect, useMemo, useContext } from 'react';
import { usePagination, useFilters } from 'react-table';
import { useHistory, useLocation } from 'react-router-dom';
import { parse, stringify } from 'query-string';

import { ProjectsTable, fuzzyTextFilter } from '../../components';
import { filterActiveProjects } from '../../utils';
import Select from '../../components/Select/Select';
import { ACTIVE_THRESHOLDS, getTableColumns } from './utils';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';

function Projects() {
  const { allProjects, allTopics } = useContext(BrigadeDataContext);
  const [filteredProjects, setFilteredProjects] = useState();
  const { search } = useLocation();
  const { tags, timeRange } = parse(search, { arrayFormat: 'comma' }) || {};
  let initialTags;
  if (tags && tags.length) {
    initialTags = Array.isArray(tags) ? initialTags : [tags];
  }
  const [filterTopics, setFilterTopics] = useState(initialTags);
  const [activeThreshold, setActiveThreshold] = useState(timeRange || 'year');
  const history = useHistory();

  // eslint-disable-next-line import/prefer-default-export
  const filterTypes = useMemo(
    () => ({
      fuzzyTextFilter,
    }),
    []
  );

  const columns = useMemo(
    () => getTableColumns(filterTopics, setFilterTopics),
    [filterTopics, setFilterTopics]
  );

  const tableAttributes = [
    {
      columns,
      data: filteredProjects || [],
      initialState: {
        pageIndex: 0,
        pageSize: filteredProjects ? filteredProjects.length : 50,
      },
      filterTypes,
    },
    useFilters,
    usePagination,
  ];

  useEffect(() => {
    setFilteredProjects(
      filterActiveProjects(allProjects, {
        timeRanges: ACTIVE_THRESHOLDS[activeThreshold],
        topics: filterTopics,
      })
    );
    history.replace(
      `?${stringify(
        {
          tags: filterTopics || tags,
          timeRange: activeThreshold || timeRange,
        },
        { arrayFormat: 'comma' }
      )}`
    );
    // eslint-disable-next-line
  }, [history, allProjects, activeThreshold, filterTopics]);

  return (
    <>
      <h1>Active projects</h1>
      <div>
        {filteredProjects && (
          <Select
            label={`Showing ${filteredProjects.length} projects with changes on Github in the last`}
            id="active_time_range"
            onChange={(e) => setActiveThreshold(e.target.value)}
            selected={activeThreshold}
            options={Object.keys(ACTIVE_THRESHOLDS)}
            inline
          />
        )}
      </div>
      <br />
      {allTopics && (
        <MultiSelect
          selectedItems={filterTopics || []}
          setSelectedItems={setFilterTopics}
          items={allTopics}
          labelText="Topics"
          onSelectionItemsChange={(newFilterTopics) =>
            setFilterTopics(newFilterTopics)
          }
        />
      )}
      <br />
      <ProjectsTable
        projects={filteredProjects || []}
        tableAttributes={tableAttributes}
      />
    </>
  );
}

export default Projects;
