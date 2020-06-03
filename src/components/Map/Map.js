import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { zoom as d3zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { select, event, mouse } from 'd3-selection';
import { feature, mesh } from 'topojson-client';
import { geoPath } from 'd3-geo';
import albersUsaPr from './geoAlbersUsaPr';
import us from '../../assets/states-10m.json';
import './Map.scss';

// TODO: improve keyboard interactivity by putting the tabindex on the groups and using arrow keys for brigades and states
// Make focused state and focused brigade states so that a user can go back to the map without tabbing through everything again

// Draws heavily from https://observablehq.com/@d3/zoom-to-bounding-box
export default function Map({ brigadeData, filterOpts, setFilterOpts }) {
  // eslint-disable-next-line no-use-before-define
  const zoom = d3zoom().scaleExtent([1, 8]).on('zoom', zoomed);
  const projection = albersUsaPr().scale(1000).translate([487.5, 305]);
  const path = geoPath(projection);
  let svg;
  let statePathsGroup;
  let brigadePoints;
  let width = 0;
  let height = 0;
  // Sort the states so that the tab index order makes sense
  us.objects.states.geometries.sort((a, b) =>
    a.properties.name.localeCompare(b.properties.name)
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

  function stateClicked(d) {
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

  function brigadeClicked(d) {
    setFilterOpts((currentFilterOpts) => ({
      ...currentFilterOpts,
      brigadeName: d.name,
    }));
  }

  function zoomed() {
    if (!statePathsGroup) return;
    const { transform } = event;
    // States
    statePathsGroup.attr('transform', transform);
    statePathsGroup.selectAll('path').attr('stroke-width', 1 / transform.k);
    // Brigade circles
    brigadePoints.attr('transform', transform);
    brigadePoints.attr('r', 10 / transform.k);
    brigadePoints.attr('stroke-width', 4 / transform.k);
  }

  const svgRef = useCallback(
    (svgNode) => {
      if (!svgNode) return;
      // Set height and width
      const svgDimensions = svgNode.getBoundingClientRect();
      width = svgDimensions.width;
      height = svgDimensions.height;

      // Do all of the d3 things once the svg node exists
      svg = select(svgNode);
      // Remove everything so that it fully rerenders on data change
      svg.selectAll('*').remove();
      statePathsGroup = svg.append('g');

      // This needs to come first so it doesn't interfere with click interactivity
      statePathsGroup
        .append('path')
        .attr('class', 'state-border')
        .attr('stroke-linejoin', 'round')
        .attr('d', path(mesh(us, us.objects.states, (a, b) => a !== b)));

      statePathsGroup
        .append('g')
        .attr('class', 'states-group')
        .selectAll('path')
        .data(feature(us, us.objects.states).features)
        .join('path')
        .on('keyup', (d) => {
          const { key } = event;
          if (key === 'Enter') {
            stateClicked(d);
          }
        })
        .on('click', stateClicked)
        .attr('d', path)
        .attr('tabindex', 0)
        .attr('aria-role', 'button')
        .append('title')
        .text((d) => d.properties.name);

      brigadePoints = svg
        .append('g')
        .selectAll('circle')
        .data(brigadeData.filter((d) => d.longitude && d.latitude))
        .enter()
        .append('circle')
        .attr('class', 'brigade-point')
        .attr('aria-role', 'button')
        .attr('tabindex', 0)
        .on('keyup', (d) => {
          const { key } = event;
          if (key === 'Enter') {
            brigadeClicked(d);
          }
        })
        .on('click', brigadeClicked)
        .attr('cx', (d) => projection([d.longitude, d.latitude])[0])
        .attr('cy', (d) => projection([d.longitude, d.latitude])[1])
        .attr('stroke-width', '3px')
        .attr('r', 10);

      brigadePoints.append('title').text((d) => d.name);

      svg.call(zoom);
    },
    [brigadeData]
  );

  // Show brigades on the map; if one is selected then make it a different color and shape
  // Sidebar (under on mobile) for project list
  // Add map zoom and region, state, brigade select menus?
  // Add buttons for zoom and reset

  return (
    <div className="map">
      <svg
        ref={svgRef}
        onClick={reset}
        preserveAspectRatio="xMinYMin meet"
        viewBox={[0, 0, 975, 610]}
      />
    </div>
  );
}

Map.defaultProps = {
  brigadeData: [],
};

export const filterOptsPropType = PropTypes.shape({
  brigadeName: PropTypes.string,
  state: PropTypes.string,
  boundingBox: PropTypes.array,
});

Map.propTypes = {
  brigadeData: PropTypes.arrayOf(PropTypes.any),
  filterOpts: filterOptsPropType.isRequired,
  setFilterOpts: PropTypes.func.isRequired,
};
