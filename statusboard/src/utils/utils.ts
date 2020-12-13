import { Bounds, latLng } from 'leaflet';
import { Brigade, Project } from './types';

export type ActiveThresholdsKeys = 'all time' | 'year' | 'month' | 'week';
export const ACTIVE_THRESHOLDS: {
  [key in ActiveThresholdsKeys]: (string | undefined)[];
} = {
  // key: user-facing string that represents the threshold
  // value: array of values for `last_pushed_within` that match the threshold
  'all time': ['month', 'week', 'year', 'over_a_year', undefined],
  year: ['month', 'week', 'year'],
  month: ['month', 'week'],
  week: ['week'],
};

export function getBaseApiUrl() {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }

  return '';
}

export function filterBrigades(
  brigadeData: Brigade[],
  filterOpts?: {
    selectedBrigade?: Brigade;
    bounds?: Bounds;
  }
) {
  // TODO: collapse this in with the filter active projects stuff
  if (!brigadeData) return [];
  let dataToFilter = brigadeData;
  const { selectedBrigade, bounds } = filterOpts || {};
  if (selectedBrigade) {
    dataToFilter = dataToFilter.filter(
      (b) => b.name === selectedBrigade!.name!
    );
  } else if (bounds) {
    dataToFilter = dataToFilter.filter((b) => {
      if (!b.latitude || !b.longitude) return false;
      // @ts-ignore
      return bounds.contains(latLng(+b.latitude, +b.longitude));
    });
  }
  return dataToFilter;
}

export function getProjectsFromBrigadeData(brigadeData: Brigade[]) {
  if (!brigadeData) return undefined;
  return brigadeData.reduce<Project[]>(
    (projects, currentBrigade) => [
      ...projects,
      ...(currentBrigade.projects || []).map((p) => ({
        ...p,
        brigade: { ...currentBrigade, projects: undefined },
      })),
    ],
    []
  );
}

function numTopicsIntersecting(
  filterByTopics: any[],
  projectTopics?: string | any[]
) {
  if (!filterByTopics?.length) return 1;
  if (!projectTopics || !projectTopics.length) return -1;
  const intersection = filterByTopics.filter((t) => projectTopics.includes(t));
  return intersection.length;
}

type ProjectWithTopicsMatched = Project & {
  numberTopicsMatched?: number;
  last_pushed_within?: string;
};
// TODO: fix active thresholds typing
export function filterActiveProjects(
  options: {
    timeRange?: ActiveThresholdsKeys;
    topics?: string[];
    brigades?: string[];
  },
  projects?: Project[]
) {
  if (!projects) return [];

  // Set destructuring and allow defaults to be overwritten
  const { timeRange, topics, brigades } = options || {};
  const timeRanges = timeRange ? ACTIVE_THRESHOLDS[timeRange] : undefined;

  let newProjects: ProjectWithTopicsMatched[] = projects;
  if (brigades) {
    newProjects = newProjects.filter((p: Project) =>
      p.brigade ? brigades.includes(p.brigade.name) : false
    );
  }
  if (topics) {
    newProjects = newProjects
      .map((p) => ({
        ...p,
        numberTopicsMatched: numTopicsIntersecting(topics, p.topics),
      }))
      .sort((a, b) => b.numberTopicsMatched - a.numberTopicsMatched)
      .filter(
        (project: ProjectWithTopicsMatched) =>
          (project.numberTopicsMatched || -1) > 0
      );
  }
  if (timeRanges) {
    newProjects = newProjects.filter((p) =>
      p.last_pushed_within ? timeRanges.includes(p.last_pushed_within) : false
    );
  }
  return newProjects;
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w]+/g, '');
}

export function getTopicsFromProjects(projects?: Project[]) {
  if (!projects) return [];
  // Sorted by frequency
  const allTopics: string[] = projects.reduce<string[]>(
    (topics, project) => topics.concat(project.topics || []),
    []
  );
  const topicsByFrequency: { [key: string]: number } = {};
  allTopics.forEach(
    (topic) => (topicsByFrequency[topic] = (topicsByFrequency[topic] || 0) + 1)
  );

  return Object.entries(topicsByFrequency)
    .sort((a, b) => b[1] - a[1])
    .map((topicAndCount) => topicAndCount[0]);
}
