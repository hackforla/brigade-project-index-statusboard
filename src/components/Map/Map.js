import React, { useCallback, useState } from 'react';
import { zoom as d3zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { select, event, mouse } from 'd3-selection';
import { feature, mesh } from 'topojson-client';
import { geoPath as path } from 'd3-geo';
// TODO: FIND THE JSON FILE THAT INCLUDES PUERTO
import us from '../../assets/states-albers-10m';
import './Map.scss';

// Taken from https://observablehq.com/@d3/zoom-to-bounding-box
export default function Map({}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const zoom = d3zoom().scaleExtent([1, 8]).on('zoom', zoomed);
  let svg, statePathsGroup;

  const svgRef = useCallback((svgNode) => {
    if (svgNode !== null) {
      // Set height and width
      const svgDimensions = svgNode.getBoundingClientRect();
      setWidth(svgDimensions.width);
      setHeight(svgDimensions.height);

      // Do all of the d3 things once the svg node exists
      svg = select(svgNode);
      statePathsGroup = svg.append('g');

      statePathsGroup
        .append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(feature(us, us.objects.states).features)
        .join('path')
        // TODO: add keyboard nav
        .on('click', clicked)
        .attr('d', path())
        // TODO: in example path was not called, but doesn't render unless it's called-- but calling it here breaks the zoom function :/
        .append('title')
        .text((d) => d.properties.name);

      statePathsGroup
        // TODO: WHAT DOES THIS EVEN DO???
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-linejoin', 'round')
        .attr('d', path(mesh(us, us.objects.states, (a, b) => a !== b)));

      svg.call(zoom);
      reset();
    }
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
