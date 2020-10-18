import L from 'leaflet';

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
  brigadeData,
  filterOpts = {
    selectedBrigade: undefined,
    // state: undefined,
    bounds: undefined,
  }
) {
  if (!brigadeData) return [];
  let dataToFilter = brigadeData;
  const { selectedBrigade, bounds } = filterOpts;
  if (selectedBrigade) {
    dataToFilter = dataToFilter.filter((b) => b.name === selectedBrigade.name);
  } else if (bounds) {
    dataToFilter = dataToFilter.filter((b) => {
      if (!b.latitude || !b.longitude) return false;
      return bounds.contains(L.latLng(b.latitude, b.longitude));
    });
  }
  return dataToFilter;
}

export function getProjectsFromBrigadeData(brigadeData) {
  if (!brigadeData) return undefined;
  return brigadeData.reduce(
    (projects, currentBrigade) => [
      ...projects,
      ...currentBrigade.projects.map((p) => ({
        ...p,
        brigade: { ...currentBrigade, projects: undefined },
      })),
    ],
    []
  );
}

export function filterActiveProjects(projects, options = {}) {
  if (!projects) return undefined;

  // Set destructuring and allow defaults to be overwritten
  const { timeRanges, topics } = {
    timeRanges: ['over_a_year'],
    topics: [],
    ...options,
  };

  return projects.filter(
    (project) =>
      timeRanges.includes(project.last_pushed_within) &&
      project.topics?.filter((t) => topics.includes(t))
  );
}

export function slugify(s) {
  return s.toLowerCase().replace(/[^\w]+/g, '');
}

export function getTopicsFromProjects(projects) {
  // Sorted by frequency
  const allTopics = projects.reduce(
    (topics, project) => topics.concat(project.topics || []),
    []
  );
  const topicsByFrequency = {};

  allTopics.forEach(
    (topic) => (topicsByFrequency[topic] = (topicsByFrequency[topic] || 0) + 1)
  );

  return Object.entries(topicsByFrequency)
    .sort((a, b) => b[1] - a[1])
    .map((topicAndCount) => topicAndCount[0]);
}
