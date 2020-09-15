import L from 'leaflet';

export function getBaseApiUrl() {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }

  return '/';
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

export function slugify(s) {
  return s.toLowerCase().replace(/[^\w]+/g, '');
}
