/* eslint-disable @typescript-eslint/no-unsafe-return */
import { parse, ParsedQuery, stringify } from 'query-string';
import { useContext, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BrigadeDataContext from '../contexts/BrigadeDataContext';
import { Project } from './types';
import {
  ActiveThresholdsKeys,
  filterActiveProjects,
  filterProjectsByBrigades,
  filterProjectsByTime,
  filterProjectsByTags,
  filterProjectsByCfA,
} from './utils';

export type Filter = {
  topics?: string[];
  timeRange?: string;
  brigades?: string[];
  onlyCfA?: string;
};

export type ProjectFilterReturn = Filter & {
  projectsFilteredByTime: Project[];
  projectsFilteredByTags: Project[];
  projectsFilteredByBrigades: Project[];
  projectsFilteredByAllParams: Project[];
  projectsFilteredByCfA: Project[];
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
    topics: _topics,
    timeRange,
    brigades,
    onlyCfA,
  } = (queryParameters || {}) as {
    topics: string[];
    timeRange: ActiveThresholdsKeys;
    brigades: string[];
    onlyCfA: string;
  };

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
    [brigades, allProjects],
  );

  const projectsFilteredByAllParams = useMemo<Project[]>(
    () => filterActiveProjects({ topics, timeRange, brigades, onlyCfA }, allProjects),
    [topics, timeRange, brigades, onlyCfA, allProjects],
  );

  const projectsFilteredByCfA = useMemo<Project[]>(
    () => filterProjectsByCfA(allProjects || [], onlyCfA),
    [onlyCfA, allProjects],
  );


  const history = useHistory();
  const setFilters = (newFilter: Filter, preserveFilters = true) => {
    let _newFilter = newFilter;
    if (preserveFilters) {
      _newFilter = { topics, timeRange, brigades, onlyCfA, ...newFilter };
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
    projectsFilteredByTags,
    projectsFilteredByBrigades,
    projectsFilteredByAllParams,
  };
};
