import React, { useCallback } from 'react';
import { zoom as d3zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { select, event, mouse } from 'd3-selection';
import { feature, mesh } from 'topojson-client';
import { geoPath } from 'd3-geo';
// TODO: FIND THE JSON FILE THAT INCLUDES PUERTO
import us from '../../assets/states-albers-10m';
import './Map.scss';

// Taken from https://observablehq.com/@d3/zoom-to-bounding-box
export default function Map({}) {
  const zoom = d3zoom().scaleExtent([1, 8]).on('zoom', zoomed);
  const path = geoPath();
  let svg, statePathsGroup;
  let width = 0;
  let height = 0;
  // Sort the states so that the tab index order makes sense
  us.objects.states.geometries.sort((a, b) =>
    a.properties.name.localeCompare(b.properties.name)
  );

  const svgRef = useCallback((svgNode) => {
    if (!svgNode) return;
    // Set height and width
    const svgDimensions = svgNode.getBoundingClientRect();
    width = svgDimensions.width;
    height = svgDimensions.height;

    // Do all of the d3 things once the svg node exists
    svg = select(svgNode);
    statePathsGroup = svg.append('g');

    statePathsGroup
      .append('g')
      .attr('class', 'states-group')
      .selectAll('path')
      .data(feature(us, us.objects.states).features)
      .join('path')
      // TODO: add keyboard nav
      .on('click', clicked)
      .attr('d', path)
      .attr('tabindex', 0)
      .append('title')
      .text((d) => d.properties.name);

    statePathsGroup
      .append('path')
      .attr('class', 'state-border')
      .attr('stroke-linejoin', 'round')
      .attr('d', path(mesh(us, us.objects.states, (a, b) => a !== b)));

    svg.call(zoom);
    reset();
  }, []);

  return (
    <div className="map">
      <svg
        ref={svgRef}
        onClick={reset}
        preserveAspectRatio="xMinYMin meet"
        viewBox={[0, 0, 975, 610]}
      ></svg>
    </div>
  );

  function reset() {
    if (!svg) return;
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        zoomIdentity,
        zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
  }

  function clicked(d) {
    if (!svg) return;
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        zoomIdentity
          .translate(width / 2, height / 2)
          .scale(
            Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        mouse(svg.node())
      );
  }

  function zoomed() {
    if (!statePathsGroup) return;
    const { transform } = event;
    statePathsGroup.attr('transform', transform);
    statePathsGroup.attr('stroke-width', 1 / transform.k);
  }
}
