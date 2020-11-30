import { parse, stringify } from 'query-string';
import { useContext, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BrigadeDataContext from '../contexts/BrigadeDataContext';
import { Project } from './types';
import { ACTIVE_THRESHOLDS, filterActiveProjects } from './utils';

type Filter = {
  topics?: string[];
  timeRange?: string;
  brigades?: string[];
};

type ProjectFilterReturn = Filter & {
  projectsFilteredByTime: Project[];
  projectsFilteredByTopics: Project[];
  projectsFilteredByBrigades: Project[];
  projectsFilteredByAllParams: Project[];
  setFilters: (filter: Filter) => void;
};

export const useProjectFilters = (): ProjectFilterReturn => {
  const { allProjects } = useContext(BrigadeDataContext);
  const { search } = useLocation();
  // TODO: add any brigade or topic key value pair to this filtering too, and use that to persist text based filtering (for table)
  const { topics: _topics, timeRange: timeRangeKey, brigades } = (parse(
    search,
    {
      arrayFormat: 'comma',
    }
  ) || {}) as { topics: string[]; timeRange: string; brigades: string[] };

  const timeRanges = timeRangeKey ? ACTIVE_THRESHOLDS[timeRangeKey] : undefined;

  let topics = _topics;
  if (_topics?.length) {
    topics = Array.isArray(_topics) ? _topics : [_topics];
  }

  const projectsFilteredByTime = useMemo<Project[]>(
    () => filterActiveProjects({ timeRanges }, allProjects),
    [timeRanges, allProjects]
  );

  const projectsFilteredByTopics = useMemo<Project[]>(
    () => filterActiveProjects({ topics }, allProjects),
    [topics, allProjects]
  );

  // TODO
  const projectsFilteredByBrigades = useMemo<Project[]>(
    () => filterActiveProjects({ brigades }, allProjects),
    [brigades, allProjects]
  );

  const projectsFilteredByAllParams = useMemo<Project[]>(
    () => filterActiveProjects({ topics, timeRanges, brigades }, allProjects),
    [topics, timeRanges, brigades, allProjects]
  );

  const history = useHistory();
  // TODO: FIX TYPING OF ACTIVE THRESHOLD
  const setFilters = (newFilter: Filter) =>
    history.replace(
      `?${stringify(
        {
          ...{
            topics,
            timeRange: timeRangeKey,
            brigades,
          },
          ...newFilter,
        },
        { arrayFormat: 'comma' }
      )}`
    );

  return {
    topics,
    timeRange: timeRangeKey,
    brigades,
    setFilters,
    projectsFilteredByTime,
    projectsFilteredByTopics,
    projectsFilteredByBrigades,
    projectsFilteredByAllParams,
  };
};
