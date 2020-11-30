import { parse, stringify } from 'query-string';
import { useContext, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BrigadeDataContext from '../contexts/BrigadeDataContext';
import { Project } from './types';
import { filterActiveProjects } from './utils';

type Filter = {
  topics?: string[];
  timeRange?: string;
  brigades?: string[];
};

type ProjectFilterReturn = Filter & {
  projectsFilteredByTime: Project[];
  projectsFilteredByTopics: Project[];
  // projectsFilteredByBrigades: Project[],
  projectsFilteredByAllParams: Project[];
  setFilters: (filter: Filter) => void;
};

export const useProjectFilters = (): ProjectFilterReturn => {
  const { allProjects } = useContext(BrigadeDataContext);
  const { search } = useLocation();
  // TODO: add any brigade or topic key value pair to this filtering too, and use that to persist text based filtering (for table)
  const { topics, timeRange, brigades } = (parse(search, {
    arrayFormat: 'comma',
  }) || {}) as { topics: string[]; timeRange: string; brigades: string[] };

  const projectsFilteredByTime = useMemo<Project[]>(
    () => filterActiveProjects(allProjects, { timeRanges: [timeRange] }),
    [timeRange]
  );

  const projectsFilteredByTopics = useMemo<Project[]>(
    () => filterActiveProjects(allProjects, { topics }),
    [topics]
  );

  // TODO
  // const projectsFilteredByBrigades = useMemo<Project[]>(filterActiveProjects(allProjects, { brigades }), [topics]);

  const projectsFilteredByAllParams = useMemo<Project[]>(
    () =>
      filterActiveProjects(allProjects, { topics, timeRanges: [timeRange] }),
    [topics, timeRange]
  );

  const history = useHistory();
  // TODO: FIX TYPING OF ACTIVE THRESHOLD
  const setFilters = ({
    topics: newTopics,
    timeRange: newTimeRange,
    brigades: newBrigades,
  }: Filter) =>
    history.replace(
      `?${stringify(
        {
          topics: topics || newTopics,
          timeRange: timeRange || newTimeRange,
          brigades: brigades || newBrigades,
        },
        { arrayFormat: 'comma' }
      )}`
    );

  return {
    topics,
    timeRange,
    brigades,
    setFilters,
    projectsFilteredByTime,
    projectsFilteredByTopics,
    // projectsFilteredByBrigades,
    projectsFilteredByAllParams,
  };
};
