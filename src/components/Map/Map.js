import React, { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { ReactComponent as Circle } from './Icon.svg';
import { Button } from '..';
import 'leaflet/dist/leaflet.css';
import './Map.scss';

// TODO: improve keyboard interactivity by putting the tabindex on the groups and using arrow keys for brigades and states
// Make focused state and focused brigade states so that a user can go back to the map without tabbing through everything again

export default function Map({ brigadeData, filterOpts, setFilterOpts }) {
  // Show brigades on the map; if one is selected then make it a different color and shape
  // Sidebar (under on mobile) for project list
  // Add map zoom and region, state, brigade select menus?
  // Add buttons for zoom and reset

  const defaultZoom = 3;
  const defaultCenter = [44.967243, -103.771556];
  const [zoom, setZoom] = useState(defaultZoom);
  const [center, setCenter] = useState(defaultCenter);
  const { name: selectedBrigadeName } = filterOpts.selectedBrigade || {};

  useEffect(() => {
    if (filterOpts.selectedBrigade) {
      // Set that brigade as the center
      setZoom(8);
      const { latitude, longitude } = filterOpts.selectedBrigade || {};
      setCenter([latitude, longitude]);
    }
  }, [selectedBrigadeName]);

  return (
    <div className="map leaflet-container">
      <LeafletMap
        // TODO: WHY IS FOCUS STYLING NOT WORKING ON ZOOM BUTTONS??
        zoom={zoom}
        center={center}
        onMoveend={(e) => {
          const {
            _zoom: newZoom,
            _lastCenter: { lat: newLat, lng: newLon },
          } = e.target;
          setFilterOpts({ ...filterOpts, bounds: e.target.getBounds() });
          setZoom(newZoom);
          setCenter([newLat, newLon]);
        }}
      >
        {/* TODO: ADD STATE OVERLAY? https://leafletjs.com/reference-1.6.0.html#svgoverlay */}
        {brigadeData.map((b) => {
          if (!b.latitude || !b.longitude)
            return <React.Fragment key={b.name} />;
          const myIcon = L.divIcon({
            html: renderToString(<Circle />),
            className:
              b.name === selectedBrigadeName
                ? 'brigade-point selected'
                : 'brigade-point',
            title: b.name,
            riseOnHover: true,
          });
          return (
            <Marker
              position={[+b.latitude, +b.longitude]}
              key={b.name}
              icon={myIcon}
            >
              {/* TODO: center the dot-- it's off from the cities */}
              <Popup>
                <Button
                  onClick={() => setFilterOpts({ selectedBrigade: b })}
                  type="button"
                  text={b.name}
                  linkButton
                />
                <div>{`${b.projects.length} projects`}</div>
              </Popup>
            </Marker>
          );
        })}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LeafletMap>
      <Button
        className="reset-button"
        onClick={() => {
          setZoom(defaultZoom);
          setCenter(defaultCenter);
        }}
        text="Reset map"
        disabled={zoom === defaultZoom && center[0] === defaultCenter[0]}
      />
    </div>
  );
}

Map.defaultProps = {
  brigadeData: [],
};

export const filterOptsPropType = PropTypes.shape({
  selectedBrigade: PropTypes.shape(),
  state: PropTypes.string,
  boundingBox: PropTypes.array,
});

Map.propTypes = {
  brigadeData: PropTypes.arrayOf(PropTypes.any),
  filterOpts: filterOptsPropType.isRequired,
  setFilterOpts: PropTypes.func.isRequired,
};
