import React, {
  useMemo,
  useContext,
  ChangeEvent,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  usePagination,
  useFilters,
  Column,
  TableOptions,
  PluginHook,
  FilterTypes,
  Filters,
  useSortBy,
} from 'react-table';
import { fuzzyTextFilter } from '../../components';
import ProjectsTable from '../../components/ProjectsTable/ProjectsTable';
import { ACTIVE_THRESHOLDS, getTopicsFromProjects, customStringSort, lastPushSort } from '../../utils/utils';
import Select from '../../components/Select/Select';
import Checkbox from '../../components/Checkbox/Checkbox';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';
import { LoadingIndicator } from '../../components/LoadingIndicator/LoadingIndicator';
import { useProjectFilters } from '../../utils/useProjectFilters';
import { Project } from '../../utils/types';
import getTableColumns from './utils';
import queryParamFilter from '../../components/ProjectsTable/QueryParamFilter';
import TaxonomyDataContext from '../../contexts/TaxonomyDataContext';
import './Projects.scss';


function Projects(): JSX.Element {
  const { allTopics, loading } = useContext(BrigadeDataContext);
  const [rowCounter, setRowCounter] = useState(0);

  const { priorityAreasMap, issuesMap } = useContext(TaxonomyDataContext);

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
    []
  );

  const sortTypes = {
    customStringSort,
    lastPushSort
  };



  const columns: Column<Project>[] = useMemo(
    () => getTableColumns(topics, setFilters),
    [topics, setFilters]
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
        pageSize: 50,
        filters: initialFilterValues,
        sortBy: [
          {
            id: 'last_pushed_within',
          },
          {
            id: 'name',
          },
        ],
      },
      filterTypes,
      sortTypes,
      setRowCounter,
    }),
    [filteredProjects, columns, sortTypes, filterTypes, initialFilterValues]
  );

  const hooks: PluginHook<Project>[] = useMemo(
    () => [useFilters, useSortBy, usePagination],
    []
  );

  // the options for the Issues dropdown, prepend an empty string
  const issueOptions = [''].concat([...issuesMap.keys()]);
  const priorityAreasOptions = [''].concat([...priorityAreasMap.keys()]);

  const issueSelect = useRef<HTMLSelectElement>();
  const priorityAreaSelect = useRef<HTMLSelectElement>();

  const clearPriorityAreaSelect = useCallback(() => {
    if (priorityAreaSelect.current)
      priorityAreaSelect.current.selectedIndex = 0;
  }, []);

  const clearIssueSelect = useCallback(() => {
    if (issueSelect.current) issueSelect.current.selectedIndex = 0;
  }, []);

  function clearTaxonomy() {
    clearIssueSelect();
    clearPriorityAreaSelect();
  }

  return (
    <>
      <h1>CfA brigade projects</h1>
      <LoadingIndicator loading={loading}>
        <>
          <div>
            <Select
              extraRef={null}
              label={`Showing ${rowCounter} projects with changes on Github in the last `}
              id="active_time_range"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilters({ timeRange: e.target.value })
              }
              selected={timeRange}
              options={Object.keys(ACTIVE_THRESHOLDS)}
            />
            <Checkbox
              label="Display non-brigade projects?"
              id="non_brigade_projects"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilters({ nonCfA: String(e.target.checked) })
              }
            />
            <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
              <Select
                extraRef={issueSelect}
                label=" Search by Issue "
                id="select-issue"
                options={issueOptions}
                emptyOptionText=""
                onChange={(event) => {
                  if (!event || !event.target) return;
                  const newVal = event.target.value;
                  if (typeof newVal === 'string') {
                    const tags = issuesMap.get(newVal) ?? [];
                    setFilters({ topics: tags });
                  }
                  clearPriorityAreaSelect();
                }}
              />
              <Select
                extraRef={priorityAreaSelect}
                label=" Search by Priority Action Areas "
                id="select-priority-areas"
                options={priorityAreasOptions}
                emptyOptionText=""
                onChange={(event) => {
                  if (!event || !event.target) return;
                  const newVal = event.target.value;
                  if (typeof newVal === 'string') {
                    const tags = priorityAreasMap.get(newVal) ?? [];
                    setFilters({ topics: tags });
                  }
                  clearIssueSelect();
                }}
              />
            </div>
          </div>
          <br />
          {availableTopics && (
            <MultiSelect
              clearTaxonomy={clearTaxonomy}
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
          <div className="hideThirdAndFourthColumns">
            <ProjectsTable
              options={options}
              plugins={hooks}
              setRowCounter={setRowCounter}
            />
          </div>
        </>
      </LoadingIndicator>
    </>
  );
}

export default Projects;
