/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React, {
  useMemo,
  useContext,
  ChangeEvent,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import $ from 'jquery';
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
import Divider from '../../components/Divider/Divider';
import {
  ACTIVE_THRESHOLDS,
  getTagsFromProjects,
  customStringSort,
  lastPushSort,
  ActiveThresholdsKeys,
} from '../../utils/utils';
import SelectWidget from '../../components/SelectWidget/SelectWidget';
import Checkbox from '../../components/Checkbox/Checkbox';
import { MultiSelect } from '../../components/Projects/MultiSelect/MultiSelect';
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

import { SelectedTags } from '../../components/Projects/SelectedTags';
import TextInput from '../../components/TextInput/TextInput';
import ComboWidget from '../../components/SelectWidget/ComboWidget';

function getDistanceToBottom(jqueryElem: string): number {
  const top = $(jqueryElem).offset()?.top || 0;
  const height = window.innerHeight - top;
  return height;
}

function setHeightToBottom(jqueryElement: string): void {
  const width = window.innerWidth;
  if (width < 800) {
    $('#filter-and-right-panel').css({ display: 'block' });
    $(jqueryElement).removeAttr('height');
    // $(jqueryElement).removeAttr('overflow-y');
    // $(jqueryElement).height(3000);
    $(jqueryElement).css({ overflowY: 'visible' });
  } else {
    $('#filter-and-right-panel').css({ display: 'flex' });
    const height = getDistanceToBottom(jqueryElement) - 25;
    $(jqueryElement).height(height);
    $(jqueryElement).css({ overflowY: 'scroll' });
  }
}

function Projects(): JSX.Element {
  const { allTags, loading } = useContext(BrigadeDataContext);
  const [rowCounter, setRowCounter] = useState(0);
  const [displayOverview, setDisplayOverview] = useState(true);
  const [selectedItem, setSelectedItem] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { priorityAreasMap, issuesMap, isTaxonomyError } =
    useContext(TaxonomyDataContext);

  // useEffect(() => {
  //   window.addEventListener('resize', (event) => {
  //     setHeightToBottom('#projects-table');
  //   });
  // });

  const {
    topics,
    timeRange,
    organization,
    project,
    description,
    onlyCfA,
    setFilters,
    projectsFilteredByTime,
    projectsFilteredByAllParams: filteredProjects,
    queryParameters,
  } = useProjectFilters();

  // Tags
  const availableTags = useMemo(() => {
    if (!projectsFilteredByTime) return allTags;
    return getTagsFromProjects(projectsFilteredByTime);
  }, [projectsFilteredByTime, allTags]);
  const { allProjects } = useContext(BrigadeDataContext);
  const allOrganizations = [
    ...new Set(allProjects.map((project) => project.brigade?.name)),
  ];
  const selectOrganizations = allOrganizations.map((org) => org);

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

  const options: TableOptions<Project> = useMemo(() => {
    return {
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
    };
  }, [filteredProjects, columns, sortTypes, filterTypes, initialFilterValues]);

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

  const displayActiveClass = (display: boolean): string => {
    return display ? 'active' : '';
  };

  const displayHideClass = (display: boolean): string => {
    return display ? '' : 'hidden';
  };

  const displayCollapseExpand = (display: boolean): string => {
    return display ? collapse : expand;
  };

  const toggleDisplayOverview = () => {
    setDisplayOverview(!displayOverview);
  };

  const collapse = '▲';
  const expand = '▼';
  type InputElement = ChangeEvent<HTMLInputElement>;

  type SelectElement = ChangeEvent<HTMLSelectElement>;
  console.log('only', onlyCfA);
  return (
    <>
      <LoadingIndicator loading={loading}>
        <div>
          <button
            type="button"
            className={`accordionButton ${displayActiveClass(displayOverview)}`}
            onClick={toggleDisplayOverview}
          >
            <div className="accordionButtonInnerDiv">
              <div>Overview</div>
              <div className="accordionCollapseExpand">
                {displayCollapseExpand(displayOverview)}
              </div>
            </div>
          </button>{' '}
          <div
            className={`overviewSection ${displayHideClass(displayOverview)}`}
          >
            <ProjectsOverview />
          </div>
          <Divider />
          <div
            id="left-filter-panel"
            className="filter-section"
            style={{ display: 'inline-flex' }}
          >
            <div className="filter-title-panel">Filter</div>
            <div id="filter-left-side" className="filter-panel">
              <SelectWidget
                extraRef={null}
                label="Code changed since"
                id="active_time_range"
                onChange={(e: SelectElement) => {
                  const value = e.target.value as ActiveThresholdsKeys;
                  setFilters({ timeRange: value });
                }}
                selected={timeRange}
                inputClassName="query-select-widget-width"
                // inputClassName="query-select-widget-width"
                options={Object.keys(ACTIVE_THRESHOLDS)}
              />
              {!isTaxonomyError && (
                <div>
                  <SelectWidget
                    extraRef={issueSelect}
                    label="Filter By Topic Tags"
                    id="select-issue"
                    inputClassName="query-select-widget-width tagFilterSectionSelect"
                    options={issueOptions}
                    emptyOptionText=""
                    onChange={(event: SelectElement) => {
                      if (!event || !event.target) return;
                      const newVal = event.target.value;
                      if (typeof newVal === 'string') {
                        let tags = issuesMap.get(newVal) ?? [];
                        tags = tags.filter(
                          (tag) => !(topics || []).includes(tag)
                        );
                        setFilters({ topics: [...(topics || []), ...tags] });
                      }
                      clearPriorityAreaSelect();
                    }}
                  />
                  <MultiSelect
                    clearTaxonomy={clearTaxonomy}
                    inputClassName="tag-filter-section-multi-select"
                    selectedItems={topics}
                    setSelectedItem={setSelectedItem}
                    setInputValue={setInputValue}
                    inputValue={inputValue}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    availableTags={availableTags}
                    labelText="Filter by Tags"
                    setSelectedItems={(newTags: string[] | undefined) =>
                      setFilters({ topics: newTags })
                    }
                  />

                  {/* <SelectWidget
                      inputClassName="query-input-width tagFilterSectionSelect"
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
                    /> */}
                </div>
              )}
            </div>
            {availableTags && (
              <>
                <div id="filter-right-panel" className="filter-panel">
                  <Checkbox
                    label="Only Code For America?"
                    id="only_cfa_projects"
                    onChange={(e: InputElement) =>
                      setFilters({ onlyCfA: String(e.target.checked) })
                    }
                    defaultValue={onlyCfA}
                  />
                  <ComboWidget
                    label="Organization"
                    id="Organization"
                    options={selectOrganizations}
                    onChange={(e: InputElement) =>
                      setFilters({ organization: e.target.value })
                    }
                    inputClassName="query-input-width"
                    defaultValue={organization}
                  />
                  <TextInput
                    label="Project Name"
                    id="project"
                    inputClassName="query-input-width"
                    onChange={(e) => setFilters({ project: e.target.value })}
                    defaultValue={project}
                  />
                  <TextInput
                    label="Description"
                    id="description"
                    inputClassName="query-input-width"
                    onChange={(e: InputElement) =>
                      setFilters({ description: e.target.value })
                    }
                    defaultValue={description}
                  />
                </div>
              </>
            )}
          </div>
          <SelectedTags
            selectedItems={topics}
            setSelectedItems={(newTags: string[] | undefined) =>
              setFilters({ topics: newTags })
            }
            clearTaxonomy={clearTaxonomy}
          />
          <div className="flex" id="projects-table-section">
            <div
              id="projects-table"
              className="hideFifthColumn"
              style={{
                height: `${getDistanceToBottom('#projects-table') - 25}px`,
                overflowY: 'scroll',
              }}
            >
              <ProjectsTable
                options={options}
                plugins={hooks}
                setRowCounter={setRowCounter}
              />
            </div>
          </div>
        </div>
      </LoadingIndicator>
    </>
  );
}

export default Projects;
