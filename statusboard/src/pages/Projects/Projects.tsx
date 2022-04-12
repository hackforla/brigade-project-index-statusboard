/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
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
import ProjectsTable from '../../components/Projects/ProjectsTable/ProjectsTable';
import {
  ACTIVE_THRESHOLDS,
  getTopicsFromProjects,
  customStringSort,
  lastPushSort,
} from '../../utils/utils';
import Select from '../../components/Select/Select';
import Checkbox from '../../components/Checkbox/Checkbox';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { ProjectsOverview } from '../../components/Projects/ProjectsOverview';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';
import { LoadingIndicator } from '../../components/LoadingIndicator/LoadingIndicator';
import { useProjectFilters } from '../../utils/useProjectFilters';
import { Project } from '../../utils/types';
import getTableColumns from './utils';
import queryParamFilter from '../../components/Projects/ProjectsTable/QueryParamFilter';
import TaxonomyDataContext from '../../contexts/TaxonomyDataContext';
import './Projects.scss';
import './modal.css';
import { Tags } from '../../components/MultiSelect/Tags';

function Projects(): JSX.Element {
  const { allTopics, loading } = useContext(BrigadeDataContext);
  const [rowCounter, setRowCounter] = useState(0);
  const [displayOverviewClass, setDisplayOverview] = useState(true);

  const { priorityAreasMap, issuesMap, isTaxonomyError } =
    useContext(TaxonomyDataContext);

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

  const clearTaxonomy = useCallback(() => {
    clearIssueSelect();
    clearPriorityAreaSelect();
  }, [clearIssueSelect, clearPriorityAreaSelect]);

  const toggleDisplayOverview = () => {
    setDisplayOverview(!displayOverviewClass);
  };

  const displayActiveClass = (display: boolean): string => {
    return display ? 'active' : '';
  };

  const displayHideClass = (display: boolean): string => {
    return display ? '' : 'hidden';
  };

  const displayCollapseExpand = (display: boolean): string => {
    return display ? collapse : expand;
  };
  const collapse = '▲';
  const expand = '▼';
  return (
    <>
      <LoadingIndicator loading={loading}>
        <>
          <button
            type="button"
            className={`accordion ${displayActiveClass(displayOverviewClass)}`}
            onClick={toggleDisplayOverview}
          >
            Overview {displayCollapseExpand(displayOverviewClass)}
          </button>
          <div className={`${displayHideClass(displayOverviewClass)}`}>
            <ProjectsOverview />
          </div>
          <div className="flex">
            <div id="nontagFilter">
              <p>Huh</p>
              <Select
                extraRef={null}
                label="Changed on githubin the last"
                id="active_time_range"
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ timeRange: e.target.value })
                }
                selected={timeRange}
                options={Object.keys(ACTIVE_THRESHOLDS)}
              />
              <Checkbox
                label="Only Code For America projects?"
                id="only_cfa_projects"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilters({ onlyCfA: String(e.target.checked) })
                }
              />
            </div>
            <div id="tagFilter">
              <p>Tags</p>
              {!isTaxonomyError && (
                <div>
                  <Select
                    extraRef={issueSelect}
                    label="By Topic"
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
                    label="By CfA Priority Action Area "
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
              )}
              {availableTopics && (
                <>
                  <MultiSelect
                    clearTaxonomy={clearTaxonomy}
                    selectedItems={topics}
                    setSelectedItems={(newTopics: string[]) =>
                      setFilters({ topics: newTopics })
                    }
                    items={availableTopics}
                    labelText="Add Specific Tags &#128316;"
                    onSelectionItemsChange={(newTopics: string[] | undefined) =>
                      setFilters({ topics: newTopics })
                    }
                  />
                </>
              )}
            </div>
          </div>
          <Tags
            selectedItems={topics}
            setSelectedItems={(newTopics: string[]) =>
              setFilters({ topics: newTopics })
            }
            onSelectionItemsChange={(newTopics: string[] | undefined) =>
              setFilters({ topics: newTopics })
            }
          />
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
