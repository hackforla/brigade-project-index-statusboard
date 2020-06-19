import React from 'react';

function ProjectDetail({
  match: {
    params: { slug },
  },
}) {
  console.log(slug);
  return (
    <>
      <h2>Project detail page!</h2>
      <p>This is the project detail page.</p>
    </>
  );
}

export default ProjectDetail;
