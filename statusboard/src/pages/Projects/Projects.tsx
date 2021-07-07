import React, { useMemo, useContext, ChangeEvent } from 'react';
import {
  usePagination,
  useFilters,
  Column,
  TableOptions,
  PluginHook,
} from 'react-table';
import { fuzzyTextFilter } from '../../components';
import ProjectsTable from '../../components/ProjectsTable/ProjectsTable';
import { ACTIVE_THRESHOLDS, getTopicsFromProjects } from '../../utils/utils';
import Select from '../../components/Select/Select';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';
import { LoadingIndicator } from '../../components/LoadingIndicator/LoadingIndicator';
import { useProjectFilters } from '../../utils/useProjectFilters';
import { Project } from '../../utils/types';
import getTableColumns from './utils';

function Projects(): JSX.Element {
  const { allTopics, loading } = useContext(BrigadeDataContext);

  const {
    topics,
    timeRange,
    setFilters,
    projectsFilteredByTime,
    projectsFilteredByAllParams: filteredProjects,
  } = useProjectFilters();

  // Topics
  const availableTopics = useMemo(() => {
    if (!projectsFilteredByTime) return allTopics;
    return getTopicsFromProjects(projectsFilteredByTime);
  }, [projectsFilteredByTime, allTopics]);

  const filterTypes = useMemo(
    () => ({
      fuzzyTextFilter,
    }),
    [],
  );

  const columns: Column<Project>[] = useMemo(
    () => getTableColumns(topics, setFilters),
    [topics, setFilters],
  );

  const options: TableOptions<Project> = useMemo(
    () => ({
      columns,
      data: filteredProjects,
      autoResetFilters: false,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 50,
      },
    }),
    [filteredProjects, columns, filterTypes],
  );

  const hooks: PluginHook<Project>[] = useMemo(
    () => [useFilters, usePagination],
    [],
  );

  return (
    <>
      <h1>CfA brigade projects</h1>
      <LoadingIndicator loading={loading}>
        <>
          <div>
            <Select
              label={`Showing ${filteredProjects.length} projects with changes on Github in the last`}
              id="active_time_range"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilters({ timeRange: e.target.value })
              }
              selected={timeRange}
              options={Object.keys(ACTIVE_THRESHOLDS)}
              inline
            />
          </div>
          <br />
          {availableTopics && (
            <MultiSelect
              selectedItems={topics}
              setSelectedItems={(newTopics: string[]) =>
                setFilters({ topics: newTopics })
              }
              items={availableTopics}
              labelText="Topics"
              onSelectionItemsChange={(newTopics: string[] | undefined) =>
                setFilters({ topics: newTopics })
              }
            />
          )}
          <br />
          <ProjectsTable options={options} plugins={hooks} />
        </>
      </LoadingIndicator>
    </>
  );
}

export default Projects;
