import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../../components/Map/Map';
import { filterBy } from './utils';
import { getBaseApiUrl } from '../../utils';

function Brigades() {
  // Filter projects by zoomed in area of map, unless a state or brigade is highlighted

  // Changing map changes which filter function we use to filter projects
  // One filter func for brigades, one for state, one for bounding box
  const [brigadeData, setBrigadeData] = useState();
  const [tagData, setTagData] = useState();
  const [filterOpts, setFilterOpts] = useState();
  const projects = filterBy([], filterOpts);

  console.log(brigadeData, tagData);

  useEffect(() => {
    const url = `${getBaseApiUrl()}/api/data.json`;
    let brigades, tags;
    const getData = async () => {
      brigades = await axios.get(url);
      brigades = brigades.data.forEach((b) => {
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
      });
      setBrigadeData(brigades);
      tags = await axios.get(`/api/tags.json`);
      setTagData(tags.data);
    };
    getData();
  }, []);

  return (
    <>
      <h2>Brigades page!</h2>
      {/* List projects by brigades that are shown on accompanying map */}
      {/* When map zooms or moves, re-filter geographically */}
      {/* Accessible filter by region, state, or a single brigade */}
      <Map setFilterOpts={setFilterOpts} brigadeData={brigadeData} />
    </>
  );
}

export default Brigades;
