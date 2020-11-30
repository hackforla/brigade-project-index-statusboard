import React, { useState, useEffect, useMemo, useContext } from 'react';
import { usePagination, useFilters } from 'react-table';
import { useHistory, useLocation } from 'react-router-dom';
import { parse, stringify } from 'query-string';

import { ProjectsTable, fuzzyTextFilter } from '../../components';
import { filterActiveProjects, getTopicsFromProjects } from '../../utils/utils';
import Select from '../../components/Select/Select';
import { ACTIVE_THRESHOLDS, getTableColumns } from './utils';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';
import { LoadingIndicator } from '../../components/LoadingIndicator/LoadingIndicator';

function Projects() {
  const { allProjects, allTopics, loading } = useContext(BrigadeDataContext);
  const [filteredProjects, setFilteredProjects] = useState<string[]>();

  // Get query params
  const { search } = useLocation();
  const { topics, timeRange } = (parse(search, { arrayFormat: 'comma' }) ||
    {}) as { topics: string[]; timeRange: string };

  // Topics
  const filteredTopics = useMemo(() => {
    if (!filteredProjects) return allTopics;
    return getTopicsFromProjects(filterActiveProjects(allProjects, { timeRanges: timeRange }));
  }, [filteredProjects])
  let initialTopics: string[] | undefined;
  if (topics?.length) {
    initialTopics = Array.isArray(topics) ? initialTopics : [topics];
  }
  const [filterTopics, setFilterTopics] = useState<string[] | undefined>(
    initialTopics
  );

  // Time
  const [activeThreshold, setActiveThreshold] = useState(timeRange || 'year');

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
        pageSize: filteredProjects?.length || 50,
      },
      filterTypes,
    },
    useFilters,
    usePagination,
  ];

  const history = useHistory();
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
          topics: filterTopics || topics,
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
      <LoadingIndicator loading={loading}>
        <>
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
          {filteredTopics && (
            <MultiSelect
              selectedItems={filterTopics || []}
              setSelectedItems={setFilterTopics}
              items={filteredTopics}
              labelText="Topics"
              onSelectionItemsChange={(
                newFilterTopics: React.SetStateAction<string[] | undefined>
              ) => setFilterTopics(newFilterTopics)}
            />
          )}
          <br />
          <ProjectsTable
            projects={filteredProjects || []}
            tableAttributes={tableAttributes}
          />
        </>
      </LoadingIndicator>
    </>
  );
}

export default Projects;
