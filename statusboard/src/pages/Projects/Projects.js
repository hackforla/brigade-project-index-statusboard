import React, { useState, useEffect, useMemo, useContext } from 'react';
import { usePagination, useFilters } from 'react-table';

import { ProjectsTable, fuzzyTextFilter } from '../../components';
import { filterActiveProjects } from '../../utils';
import Select from '../../components/Select/Select';
import { ACTIVE_THRESHOLDS, getTableColumns } from './utils';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';

function Projects() {
  const { allProjects, allTopics } = useContext(BrigadeDataContext);
  const [filteredProjects, setFilteredProjects] = useState();
  const [activeThreshold, setActiveThreshold] = useState('year');
  const [filterTopics, setFilterTopics] = useState([]);

  // eslint-disable-next-line import/prefer-default-export
  const filterTypes = useMemo(
    () => ({
      fuzzyTextFilter,
    }),
    []
  );

  const columns = useMemo(() => getTableColumns(setFilterTopics), []);

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
  }, [allProjects, activeThreshold, filterTopics]);

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
          selectedItems={filterTopics}
          setSelectedItems={setFilterTopics}
          items={allTopics}
          labelText="Topics"
          onSelectionItemsChange={(newFilterTopics) =>
            setFilterTopics(newFilterTopics)
          }
        />
      )}
      <br />
      {/* This is just a stand-in-- we should probably make it so that we can pass column props to the table */}
      <ProjectsTable
        projects={filteredProjects || []}
        tableAttributes={tableAttributes}
      />
    </>
  );
}

export default Projects;
