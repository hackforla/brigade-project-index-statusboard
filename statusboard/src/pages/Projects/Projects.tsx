import React, { useMemo, useContext, ChangeEvent, useState } from 'react';
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
import Checkbox from '../../components/Checkbox/Checkbox';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';
import { LoadingIndicator } from '../../components/LoadingIndicator/LoadingIndicator';
import { useProjectFilters } from '../../utils/useProjectFilters';
import { Project } from '../../utils/types';
import getTableColumns from './utils';
import queryParamFilter from '../../components/ProjectsTable/QueryParamFilter';
import './Projects.scss'

function Projects(): JSX.Element {
  const { allTopics, loading } = useContext(BrigadeDataContext);
  const [rowCounter, setRowCounter] = useState(0);
  const [searchTerm,setSearchTerm] = useState("");

  const {
    topics,
    timeRange,
    setFilters,
    projectsFilteredByTime,
    projectsFilteredByText,
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
      },
      filterTypes,
      setRowCounter,
    }),
    [filteredProjects, columns, filterTypes]
  );

  const hooks: PluginHook<Project>[] = useMemo(
    () => [useFilters, usePagination],
    []
  );

  return (
    <>
      <h1>CfA brigade projects</h1>
      <LoadingIndicator loading={loading}>
        <>
          <div>
            <Select
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
  
          <div className="text-input form-control-container mobileheader">
            <label htmlFor="search">Search projects</label>
            <input type="text" className="form-control" value={searchTerm} 
            name="searchTerm" onChange={(e: ChangeEvent<HTMLInputElement>) =>{
              setFilters({ searchTerm: String(e.target.value) });
              setSearchTerm(e.target.value);}
              }/>
            </div>
          
          <ProjectsTable
            options={options}
            plugins={hooks}
            setRowCounter={setRowCounter}
          />
        </>
      </LoadingIndicator>
    </>
  );
}

export default Projects;
