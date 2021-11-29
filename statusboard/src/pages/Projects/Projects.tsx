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
  SortByFn,
  Row,
  IdType,
} from 'react-table';
import { fuzzyTextFilter } from '../../components';
import ProjectsTable from '../../components/ProjectsTable/ProjectsTable';
import { ACTIVE_THRESHOLDS, getTopicsFromProjects } from '../../utils/utils';
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

  const { priorityAreasMap, issuesMap, isTaxonomyError } = useContext(TaxonomyDataContext);

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

  const customStringSort: SortByFn<Project> = (
    rowA: Row<Project>,
    rowB: Row<Project>,
    id: IdType<Project>,
    desc?: boolean
  ): number => {
    const rowAValue: string = rowA.values[id] ?? '';
    const rowBValue: string = rowB.values[id] ?? '';

    const valueA: string = String(rowAValue).toLowerCase();
    const valueB: string = String(rowBValue).toLowerCase();
    if (desc) {
      return valueA.localeCompare(valueB) > 0 ? 1 : -1;
    }
    return valueB.localeCompare(valueA) > 0 ? -1 : 1;
  };

  function periodToNumber(period: string) {
    if (period === 'week') {
      return 0;
    }
    if (period === 'month') {
      return 1;
    }
    if (period === 'year') {
      return 2;
    }
    if (period === 'over_a_year') {
      return 3;
    }
    return 99;
  }

  const lastPushSort: SortByFn<Project> = (
    rowA: Row<Project>,
    rowB: Row<Project>,
    id: IdType<Project>,
    desc?: boolean
  ): number => {
    // need to convert week, month to 1, 2, ..
    const d1: number = periodToNumber(rowA.values[id]);
    const d2: number = periodToNumber(rowB.values[id]);
    if (desc) {
      return d1 - d2 > 0 ? 1 : -1;
    }
    return d2 - d1 > 0 ? -1 : 1;
  };

  const sortTypes: Record<string, SortByFn<Project>> = {
    customStringSort,
    lastPushSort,
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
        Here you can search for <a href="https://brigade.codeforamerica.org/">Code For America Brigades</a> and other organizatios projects.
        <br/>
        You can search by <a href="https://codeforamerica.github.io/civic-tech-taxonomy/editor-ui/">Taxonomy</a> ("Topic" or "Priority Area") or by "Tags".
        <br/>
        You can also include non "Code For America" projects as well as select a timeframe of
        when a project was last updated.
        <br/>
      <LoadingIndicator loading={loading}>
        <>
          <div>
          <br/>
            <Select
              extraRef={null}
              label={`Showing ${rowCounter} projects with changes on Github in the last  `}
              id="active_time_range"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilters({ timeRange: e.target.value })
              }
              selected={timeRange}
              options={Object.keys(ACTIVE_THRESHOLDS)}
            />
            <Checkbox
              label="Display non Code For America projects?"
              id="non_brigade_projects"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilters({ nonCfA: String(e.target.checked) })
              }
            />
            {!isTaxonomyError &&
            <fieldset style={{ 
              display: 'inline', 
              marginTop: '10px', 
              border: '2px', 
              borderStyle: 'solid', 
              borderColor: 'cfa-blue',
              borderRadius: '10px',
              padding: '10px'
              }}
              >
              <legend>Taxonomy</legend>
              <div style={{display: 'flex', gap: '30px'}}>
              <Select
                extraRef={issueSelect}
                label=" Search by Topic "
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
                label=" Search by Priority Action Area "
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
            </fieldset>}
          </div>
          {availableTopics  && (
            <MultiSelect
              clearTaxonomy={clearTaxonomy}
              selectedItems={topics}
              setSelectedItems={(newTopics: string[]) =>
                setFilters({ topics: newTopics })
              }
              items={availableTopics}
              labelText="Tags"
              onSelectionItemsChange={(newTopics: string[] | undefined) =>
                setFilters({ topics: newTopics })
              }
            />
          )}
          <br />
          <div className="hideFifthColumn">
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
