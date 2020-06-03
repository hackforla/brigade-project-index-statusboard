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

export function filterBy(
  projects,
  opts = { brigade: undefined, state: undefined, boundingBox: undefined }
) {
  if (!projects) return;
  console.log(projects);
  return projects.filter((project) => {
    let match = true;
    Object.keys(opts).forEach((opt) => {
      if (opt && project[opt] !== opts[opt]) {
        match = false;
      }
    });
    return match;
  });
}

export function slugify(s) {
  return s.toLowerCase().replace(/[^\w]+/g, '');
}

export function cleanBrigadeData(brigades) {
  if (!brigades) return;
  return brigades.data.map((b) => {
    b.tagged = b.projects.filter(
      (p) => typeof p.topics !== 'undefined' && p.topics.length
    ).length;
    b.projects.forEach((p) => {
      p.slug = slugify(p.name);
      p.normalized_topics = [];
      if (p.topics) {
        p.topics.forEach((t) => {
          const nt = t.toLowerCase().replace(/\-/g, '');
          if (!p.normalized_topics.includes(t)) {
            p.normalized_topics.push(nt);
          }
        });
      }
    });
    return b;
  });
}
