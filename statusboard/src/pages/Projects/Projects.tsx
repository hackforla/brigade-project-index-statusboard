/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-types */
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
  filterProjectsExcludeParam,
} from '../../utils/utils';
import SelectWidget from '../../components/SelectWidget/SelectWidget';
import Checkbox from '../../components/Checkbox/Checkbox';
import { MultiSelect } from '../../components/Projects/MultiSelect/MultiSelect';
import { ProjectsOverview } from '../../components/Projects/ProjectsOverview';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';
import { LoadingIndicator } from '../../components/LoadingIndicator/LoadingIndicator';
import { useProjectFilters } from '../../utils/useProjectFilters';
import { Project, ExtendedColumn } from '../../utils/types';
import getTableColumns from './utils';
import queryParamFilter from '../../components/Projects/ProjectsTable/QueryParamFilter';
import TaxonomyDataContext from '../../contexts/TaxonomyDataContext';
import './Projects.scss';
import './modal.css';
import { SelectedTags } from '../../components/Projects/SelectedTags';
import TextInput from '../../components/TextInput/TextInput';
import ComboBoxWidget from '../../components/SelectWidget/ComboBoxWidget';

export enum ExcludeParam {
  tags = "tags",
  organization = "organization"
}

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
  const [displayFilter, setDisplayFilter] = useState(true);
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
    brigades,
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
  const { allProjects } = useContext(BrigadeDataContext);
  const availableTags = useMemo(() => {
    if (!projectsFilteredByTime) return allTags;
    return getTagsFromProjects(
      filterProjectsExcludeParam(
        {
          topics,
          timeRange,
          brigades,
          onlyCfA,
          project,
          organization,
          description,
        },
        allProjects,
        ExcludeParam.tags
      )
    );
  }, [
    projectsFilteredByTime,
    allTags,
    topics,
    timeRange,
    brigades,
    onlyCfA,
    project,
    organization,
    description,
    allProjects,
  ]);
  const selectOrganizations = useMemo(() => {
    if (!projectsFilteredByTime) return allTags;
    const orgProjects = filterProjectsExcludeParam(
      {
        topics,
        timeRange,
        brigades,
        onlyCfA,
        project,
        organization,
        description,
      },
      projectsFilteredByTime,
      ExcludeParam.organization
    );
    const availableOrganizations = [
      ...new Set(orgProjects.map((project) => project.brigade?.name)),
    ];
    return availableOrganizations.map((org) => org);
  }, [
    projectsFilteredByTime,
    topics,
    timeRange,
    brigades,
    onlyCfA,
    project,
    organization,
    description,
    allTags,
  ]);

  const filterTypes: FilterTypes<Project> = useMemo(
    () => ({ fuzzyTextFilter: queryParamFilter(fuzzyTextFilter) }),
    []
  );

  const sortTypes = {
    customStringSort,
    lastPushSort,
  };

  const columns: ExtendedColumn<Project>[] = useMemo(
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
            id: 'last-pushed-within',
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

  const showHideClass = (display: boolean): string => {
    return display ? '' : 'hidden';
  };

  const displayCollapseExpand = (display: boolean): string => {
    return display ? collapse : expand;
  };

  const toggleDisplayFilter = () => {
    setDisplayFilter(!displayFilter);
  };

  const toggleDisplayOverview = () => {
    setDisplayOverview(!displayOverview);
  };

  const collapse = '▲';
  const expand = '▼';
  type InputElement = ChangeEvent<HTMLInputElement>;

  type SelectElement = ChangeEvent<HTMLSelectElement>;
  return (
    <>
      <LoadingIndicator loading={loading}>
        <div>
          <div className="display-inline-flex">
            <button
              type="button"
              className={`accordion-button ${displayActiveClass(
                displayOverview
              )}`}
              onClick={toggleDisplayOverview}
            >
              <div className="accordion-button-inner-div">
                <div>{hideShowLabel(displayOverview)}</div>
                <div className="accordion-collapse-expand">
                  {displayCollapseExpand(displayOverview)}
                </div>
              </div>
            </button>
            <div className="filter-title-panel">Overview</div>
          </div>
          <div className={`overview-section ${showHideClass(displayOverview)}`}>
            <ProjectsOverview />
          </div>
          <Divider />
          <div className="display-inline-flex">
            <button
              type="button"
              className={`accordion-button ${displayActiveClass(displayFilter)}`}
              onClick={toggleDisplayFilter}
            >
              <div className="accordion-button-inner-div">
                <div>{hideShowLabel(displayFilter)}</div>
                <div className="accordion-collapse-expand">
                  {displayCollapseExpand(displayFilter)}
                </div>
              </div>
            </button>
            <div className="filter-title-panel">{`Filter (${rowCounter} matches)`}</div>
          </div>
          <div id="show-hide" className={`${showHideClass(displayFilter)}`}>
            <div id="filter-section" className="filter-section">
              <div id="filter-left-panel" className="filter-panel">
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
                      inputClassName="query-select-widget-width tag-filter-section-selection"
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
                        setFilters({ topics: newTags })}
                    />

                    {/* <SelectWidget
                      inputClassName="query-input-width tag-filter-section-selection"
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
                  <div
                    id="filter-right-panel"
                    className="filter-panel filter-right-panel"
                  >
                    <Checkbox
                      label="Only Code For America?"
                      id="only-cfa-projects"
                      onChange={(e: InputElement) =>
                        setFilters({ onlyCfA: String(e.target.checked) })}
                      defaultValue={onlyCfA}
                    />
                    <ComboBoxWidget
                      label="Organization"
                      id="organization"
                      options={selectOrganizations}
                      onChange={(e: InputElement) => {
                        setFilters({ organization: e.target.value });
                      }}
                      onClear={() => setFilters({ organization: '' })}
                      inputClassName="query-input-width"
                      defaultValue={organization}
                    />
                    <TextInput
                      label="Project Name"
                      id="project"
                      inputClassName="query-input-width"
                      onChange={(e) => setFilters({ project: e.target.value })}
                      defaultValue={project}
                      onClear={() => setFilters({ project: '' })}
                    />
                    <TextInput
                      label="Description"
                      id="description"
                      inputClassName="query-input-width"
                      onChange={(e: InputElement) =>
                        setFilters({ description: e.target.value })}
                      onClear={() => setFilters({ description: '' })}
                      defaultValue={description}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <SelectedTags
            selectedItems={topics}
            setSelectedItems={(newTags: string[] | undefined) =>
              setFilters({ topics: newTags })}
            clearTaxonomy={clearTaxonomy}
          />
          <div id="projects-table" className="projects-table-section">
            <ProjectsTable
              options={options}
              plugins={hooks}
              setRowCounter={setRowCounter}
            />
          </div>
        </div>
      </LoadingIndicator>
    </>
  );
}

export default Projects;
function hideShowLabel(show: boolean): React.ReactNode {
  return show ? 'Hide' : 'Show';
}
