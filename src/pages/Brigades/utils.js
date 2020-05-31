export const filterBy = (
  projects,
  opts = { brigade: undefined, state: undefined, boundingBox: undefined }
) => {
  return projects.filter((project) => {
    let match = true;
    Object.keys(opts).forEach((opt) => {
      if (opt && project[opt] !== opts[opt]) {
        match = false;
      }
    });
    return match;
  });
};
