/* eslint-disable @typescript-eslint/no-unsafe-return */
import { parse, ParsedQuery, stringify } from 'query-string';
import { useContext, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BrigadeDataContext from '../contexts/BrigadeDataContext';
import { Project } from './types';
import {
  ActiveThresholdsKeys,
  filterProjectsByAllParams,
  filterProjectsByBrigades,
  filterProjectsByTime,
  filterProjectsByTags,
  filterProjectsByCfA,
  filterProjectsByProjectName,
  filterProjectsByOrganization,
} from './utils';

export type Filter = {
  topics?: string[];
  timeRange?: ActiveThresholdsKeys;
  brigades?: string[];
  onlyCfA?: string;
  project?: string;
  organization?: string; // xxxx - ok - Filter
};

export type ProjectFilterReturn = Filter & {
  projectsFilteredByTime: Project[];
  projectsFilteredByTags: Project[];
  projectsFilteredByBrigades: Project[];
  projectsFilteredByAllParams: Project[];
  projectsFilteredByCfA: Project[];
  projectsFilteredByProjectName: Project[];
  projectsFilteredByOrganization: Project[];
  setFilters: (filter: Filter, preserveFilters?: boolean) => void;
  queryParameters: ParsedQuery;
};

export const useProjectFilters = (): ProjectFilterReturn => {
  const { allProjects } = useContext(BrigadeDataContext);
  const { search } = useLocation();
  /* TODO: add any brigade or topic key value pair to this filtering too, and use that to persist text based filtering (for table) */
  const queryParameters = parse(search, {
    arrayFormat: 'comma',
  });

  const {
    topics: _topics, // ??
    timeRange,
    brigades,
    onlyCfA,
    project,
    organization, // xxxx - ok - useProjectFilters
  } = (queryParameters || {}) as Filter;

  let topics = _topics;
  if (_topics?.length) {
    topics = Array.isArray(_topics) ? _topics : [_topics];
  }

  const projectsFilteredByTime = useMemo<Project[]>(
    () => filterProjectsByTime(allProjects || [], timeRange),
    [timeRange, allProjects]
  );

  const projectsFilteredByTags = useMemo<Project[]>(
    () => filterProjectsByTags(allProjects || [], topics),
    [topics, allProjects]
  );

  const projectsFilteredByBrigades = useMemo<Project[]>(
    () => filterProjectsByBrigades(allProjects || [], brigades),
    [brigades, allProjects]
  );

  const projectsFilteredByAllParams = useMemo<Project[]>(() => {
    return filterProjectsByAllParams(
      { topics, timeRange, brigades, onlyCfA, project, organization }, // xxxx - ok - allParams
      allProjects
    );
  }, [
    topics,
    timeRange,
    brigades,
    onlyCfA,
    project,
    organization, // xxxx - ok - allParams
    allProjects,
  ]);

  const projectsFilteredByCfA = useMemo<Project[]>(
    () => filterProjectsByCfA(allProjects || [], onlyCfA),
    [onlyCfA, allProjects]
  );

  const projectsFilteredByProjectName = useMemo<Project[]>(
    () => filterProjectsByProjectName(allProjects || [], project),
    [project, allProjects]
  );

  const projectsFilteredByOrganization = useMemo<Project[]>(
    () => filterProjectsByOrganization(allProjects || [], project),
    [project, allProjects]
  );

  const history = useHistory();
  const setFilters = (newFilter: Filter, preserveFilters = true) => {
    let _newFilter = newFilter;
    console.log('setFilters', newFilter, preserveFilters);
    if (preserveFilters) {
      _newFilter = {
        topics,
        timeRange,
        brigades,
        onlyCfA,
        project,
        organization, // xxxx -  ok - setFilters
        ...newFilter,
      };
    }
    history.replace(`?${stringify(_newFilter, { arrayFormat: 'comma' })}`);
  };

  useEffect(() => {
    // On the first render, if there are no other filters,
    // set time range to a year
    if (!search) {
      setFilters({ timeRange: 'year' }, false);
    }
  });

  return {
    topics,
    timeRange,
    brigades,
    setFilters,
    queryParameters,
    projectsFilteredByTime,
    projectsFilteredByCfA,
    projectsFilteredByProjectName,
    projectsFilteredByTags,
    projectsFilteredByBrigades,
    projectsFilteredByAllParams,
    projectsFilteredByOrganization,
  };
};
