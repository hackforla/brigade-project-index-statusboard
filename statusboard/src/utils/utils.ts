import L from 'leaflet';
import Brigades from '../pages/Brigades/Brigades';
import { Brigade, Project } from './types';

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
  filterOpts = {
    selectedBrigade: undefined,
    bounds: undefined,
  }
) {
  if (!brigadeData) return [];
  let dataToFilter = brigadeData;
  const { selectedBrigade, bounds } = filterOpts;
  if (selectedBrigade) {
    dataToFilter = dataToFilter.filter((b) => b.name === selectedBrigade?.name);
  } else if (bounds) {
    dataToFilter = dataToFilter.filter((b) => {
      if (!b.latitude || !b.longitude) return false;
      return bounds?.contains(L.latLng(+b.latitude, +b.longitude));
    });
  }
  return dataToFilter;
}

export function getProjectsFromBrigadeData(brigadeData: Brigade[]) {
  if (!brigadeData) return undefined;
  return brigadeData.reduce<Project[]>(
    (projects, currentBrigade) => [
      ...projects,
      ...currentBrigade.projects?.map((p) => ({
        ...p,
        brigade: { ...currentBrigade, projects: undefined },
      })),
    ],
    []
  );
}

function numTopicsIntersecting(
  filterByTopics: any[],
  projectTopics: string | any[]
) {
  if (!filterByTopics?.length) return 1;
  if (!projectTopics || !projectTopics.length) return -1;
  const intersection = filterByTopics.filter((t) => projectTopics.includes(t));
  return intersection.length;
}

// TODO: fix active thresholds typing
export function filterActiveProjects(projects: Project[], options: { timeRanges?: string[], topics?: string[], brigades?: string[] }) {
  if (!projects) return [];

  // Set destructuring and allow defaults to be overwritten
  const { timeRanges, topics, brigades } = {
    // 
    timeRanges: ['year'],
    topics: [],
    brigades: [],
    ...options,
  };

  return projects
    .filter(p => brigades ? brigades.includes(p?.brigade?.name) : true)
    .map((p) => ({
      ...p,
      numberTopicsMatched: numTopicsIntersecting(topics, p.topics),
    }))
    .sort((a, b) => b.numberTopicsMatched - a.numberTopicsMatched)
    .filter(
      (project: Project) =>
        timeRanges.includes(project.last_pushed_within) &&
        project.numberTopicsMatched > 0
    );
}

export function slugify(s) {
  return s.toLowerCase().replace(/[^\w]+/g, '');
}

export function getTopicsFromProjects(projects: Project[]) {
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
