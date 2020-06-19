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
      <p>
        This is the project detail page. Looks like we need to add some details!
      </p>
    </>
  );
}

export default ProjectDetail;
