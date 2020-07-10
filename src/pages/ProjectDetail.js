import React from 'react';

function ProjectDetail({
  match: {
    params: { slug },
  },
}) {
  console.log(slug);
  return (
    <>
      <h1>Project detail page!</h1>
      <p>This is the project detail page.</p>
    </>
  );
}

export default ProjectDetail;
