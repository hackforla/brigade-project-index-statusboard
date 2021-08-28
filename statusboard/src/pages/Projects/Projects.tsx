import React, { useMemo, useContext, ChangeEvent } from 'react';
import {
  usePagination,
  useFilters,
  Column,
  TableOptions,
  PluginHook,
  FilterTypes,
  Filters,
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
import queryParamFilter from '../../components/ProjectsTable/QueryParamFilter';

function Projects(): JSX.Element {
  const { allTopics, loading } = useContext(BrigadeDataContext);

  const {
    topics,
    timeRange,
    setFilters,
    projectsFilteredByTime,
    projectsFilteredByAllParams: filteredProjects,
    queryParameters,
  } = useProjectFilters();

  // Topics
  const availableTopics = useMemo(() => {
    if (!projectsFilteredByTime) return allTopics;
    return getTopicsFromProjects(projectsFilteredByTime);
  }, [projectsFilteredByTime, allTopics]);

  const filterTypes: FilterTypes<Project> = useMemo(
    () => ({ fuzzyTextFilter: queryParamFilter(fuzzyTextFilter) }),
    [],
  );

  const columns: Column<Project>[] = useMemo(
    () => getTableColumns(topics, setFilters),
    [topics, setFilters],
  );
  const initialFilterValues: Filters<Project> = useMemo(
    () =>
      columns
        .filter((column) => column.id ?? column.accessor)
        .map((column) => (column.id ?? column.accessor) as string)
        .filter((name) => queryParameters[name])
        .filter(
          // Check if filtering has been disabled for the column
          (name) =>
            !columns.find((column) => (column.id ?? column.accessor) === name)
              ?.disableFilters
        )
        .map((name) => ({
          id: name,
          value: queryParameters[name],
        })),
    []
  );

  const options: TableOptions<Project> = useMemo(
    () => ({
      columns,
      data: filteredProjects || [],
      autoResetFilters: false,
      initialState: {
        pageIndex: 0,
        pageSize: filteredProjects?.length || 50,
        filters: initialFilterValues,
      },
      filterTypes,
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
      <LoadingIndicator>
        <>
          <div>
            <Select
              label={`Showing ${filteredProjects.length} projects with changes on Github in the last `}
              id="active_time_range"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilters({ timeRange: e.target.value })
              }
              selected={timeRange}
              options={Object.keys(ACTIVE_THRESHOLDS)}
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
