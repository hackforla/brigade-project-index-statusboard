import { parse, stringify } from 'query-string';
import { useContext, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BrigadeDataContext from '../contexts/BrigadeDataContext';
import { Project } from './types';
import {
  ActiveThresholdsKeys,
  filterActiveProjects,
  filterProjectsByBrigades,
  filterProjectsByTime,
  filterProjectsByTopics,
} from './utils';

type Filter = {
  topics?: string[];
  timeRange?: ActiveThresholdsKeys;
  brigades?: string[];
};

type ProjectFilterReturn = Filter & {
  projectsFilteredByTime: Project[];
  projectsFilteredByTopics: Project[];
  projectsFilteredByBrigades: Project[];
  projectsFilteredByAllParams: Project[];
  setFilters: (filter: Filter, preserveFilters?: boolean) => void;
};

export const useProjectFilters = (): ProjectFilterReturn => {
  const { allProjects } = useContext(BrigadeDataContext);
  const { search } = useLocation();
  // TODO: add any brigade or topic key value pair to this filtering too, and use that to persist text based filtering (for table)
  const { topics: _topics, timeRange, brigades } = (parse(search, {
    arrayFormat: 'comma',
  }) || {}) as {
    topics: string[];
    timeRange: ActiveThresholdsKeys;
    brigades: string[];
  };

  let topics = _topics;
  if (_topics?.length) {
    topics = Array.isArray(_topics) ? _topics : [_topics];
  }

  const projectsFilteredByTime = useMemo<Project[]>(
    () => filterProjectsByTime(allProjects || [], timeRange),
    [timeRange, allProjects]
  );

  const projectsFilteredByTopics = useMemo<Project[]>(
    () => filterProjectsByTopics(allProjects || [], topics),
    [topics, allProjects]
  );

  const projectsFilteredByBrigades = useMemo<Project[]>(
    () => filterProjectsByBrigades(allProjects || [], brigades),
    [brigades, allProjects]
  );

  const projectsFilteredByAllParams = useMemo<Project[]>(
    () => filterActiveProjects({ topics, timeRange, brigades }, allProjects),
    [topics, timeRange, brigades, allProjects]
  );

  const history = useHistory();
  const setFilters = (newFilter: Filter, preserveFilters = true) => {
    let _newFilter = newFilter;
    if (preserveFilters) {
      _newFilter = { topics, timeRange, brigades, ...newFilter };
    }
    history.replace(`?${stringify(_newFilter, { arrayFormat: 'comma' })}`);
  };

  useEffect(() => {
    // On the first render, if there are no other filters, set time range to a year
    if (!search) {
      setFilters({ timeRange: 'year' }, false);
    }
  }, []);

  return {
    topics,
    timeRange: timeRange,
    brigades,
    setFilters,
    projectsFilteredByTime,
    projectsFilteredByTopics,
    projectsFilteredByBrigades,
    projectsFilteredByAllParams,
  };
};
