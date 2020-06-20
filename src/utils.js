import L from 'leaflet';

export function getBaseApiUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }
  // TODO: WHAT SHOULD THIS RETURN?
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
  }
  if (bounds) {
    dataToFilter = dataToFilter.filter((b) => {
      if (!b.latitude || !b.longitude) return false;
      return bounds.contains(L.latLng(b.latitude, b.longitude));
    });
  }
  return dataToFilter;
}

export function getProjectsFromBrigadeData(brigadeData) {
  if (!brigadeData) return [];
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

export function cleanBrigadeData(brigades) {
  if (!brigades) return [];
  return brigades.data.map((b) => {
    b.tagged = b.projects.filter(
      (p) => typeof p.topics !== 'undefined' && p.topics.length
    ).length;
    b.projects.forEach((p) => {
      p.slug = slugify(p.name);
      p.normalized_topics = [];
      if (p.topics) {
        p.topics.forEach((t) => {
          const nt = t.toLowerCase().replace(/-/g, '');
          if (!p.normalized_topics.includes(t)) {
            p.normalized_topics.push(nt);
          }
        });
      }
    });
    return b;
  });
}
