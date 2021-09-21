import { Bounds, latLng } from 'leaflet';
import { Brigade, Project } from './types';

export type ActiveThresholdsKeys = 'all time' | 'year' | 'month' | 'week';
// key: user-facing string that represents the threshold
export const ACTIVE_THRESHOLDS: {
  [key in ActiveThresholdsKeys]: (string | undefined)[];
} = {
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

export function filterBrigades(
  brigadeData: Brigade[],
  filterOpts?: {
    selectedBrigade?: Brigade;
    bounds?: Bounds;
  }
) {
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

export function filterProjectsByBrigades(
  projects: Project[],
  brigadeNames?: string[]
) {
  if (!brigadeNames?.length) return projects;
  return projects.filter((p: Project) =>
    p.brigade ? brigadeNames.includes(p.brigade.name) : false
  );
}

type ProjectWithTopicsMatched = Project & {
  numberTopicsMatched?: number;
};
export function filterProjectsByTopics(projects: Project[], topics?: string[]) {
  if (!topics?.length) return projects;
  return projects
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

export function filterProjectsByTime(
  projects: Project[],
  timeRangeKey?: ActiveThresholdsKeys
) {
  const timeRanges = timeRangeKey ? ACTIVE_THRESHOLDS[timeRangeKey] : undefined;
  if (!timeRanges) return projects;
  return projects.filter((p) => timeRanges.includes(p.last_pushed_within));
}

export function filterProjectsByCfA(
  projects: Project[],
  nonCfA?: string
) {
  if (nonCfA === 'true') {
    console.log("returning all projects");
    console.log(projects.length);
    return projects;
  }
  console.log("filter only cfa projects");
  return projects.filter((p: Project) =>
    p?.brigade?.type ? p.brigade.type.includes("brigade") || p.brigade.type.includes("Code for America") : false
  );

}

export function filterActiveProjects(
  options: {
    timeRange?: ActiveThresholdsKeys;
    topics?: string[];
    brigades?: string[];
    nonCfA: string;
  },
  projects?: Project[]
) {
  if (!projects) return [];
  // Set destructuring and allow defaults to be overwritten
  const { timeRange, topics, brigades, nonCfA } = options || {};
  let newProjects: ProjectWithTopicsMatched[] = filterProjectsByBrigades(
    projects,
    brigades
  );
  newProjects = filterProjectsByTopics(newProjects, topics);
  newProjects = filterProjectsByTime(newProjects, timeRange);
  newProjects = filterProjectsByCfA(newProjects, nonCfA);
  console.log("FilterActiveProjects");
  console.log(newProjects.length);
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
