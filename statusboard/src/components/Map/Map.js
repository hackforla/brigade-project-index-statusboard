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
  const defaultZoom = 2;
  const storedCenter = [
    parseFloat(localStorage.getItem('lat')),
    parseFloat(localStorage.getItem('lng')),
  ];

  const defaultCenter = [44.967243, -104.771556];

  const [zoom, setZoom] = useState(localStorage.getItem('zoom') || defaultZoom);
  const [center, setCenter] = useState(
    !Number.isNaN(storedCenter[0]) ? storedCenter : defaultCenter
  );

  const { name: selectedBrigadeName } = filterOpts.selectedBrigade || {};

  useEffect(() => {
    if (filterOpts.selectedBrigade) {
      // Set that brigade as the center, prioritize that over stored location
      setZoom(8);
      const { latitude, longitude } = filterOpts.selectedBrigade || {};
      setCenter([latitude, longitude]);
    } else if (!Number.isNaNstoredCenter[0]) {
      // if there is no selected brigade NOR a location stored in localstorage, get user's location, or not
      let userCenter = [];
      const foundLocation = (position) => {
        userCenter = [position.coords.latitude, position.coords.longitude];
        setZoom(2);
        setCenter(userCenter);
      };
      const noLocation = () => {
        setZoom(defaultZoom);
        setCenter(defaultCenter);
      };

      const options = { timeOut: 20000, maximumAge: 60 * 60 * 24 * 1000 };

      navigator.geolocation.getCurrentPosition(
        foundLocation,
        noLocation,
        options
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrigadeName]);

  return (
    <div className="map leaflet-container">
      <LeafletMap
        // TODO: WHY IS FOCUS STYLING NOT WORKING ON ZOOM BUTTONS??
        zoom={zoom}
        center={center}
        // FYI moveend fires CONSTANTLY, like,
        // upon first loading map
        // multiple times when panning
        // basically whenever it feels like it
        // TODO: add timeout so it fires slightly less often
        onMoveend={(e) => {
          const { _zoom: newZoom, _lastCenter } = e.target || {};
          const { lat: newLat, lng: newLon } = _lastCenter || {};
          setFilterOpts({ ...filterOpts, bounds: e.target.getBounds() });
          if (newZoom) {
            setZoom(newZoom);
            localStorage.setItem('zoom', newZoom);
          }
          if (_lastCenter) {
            setCenter([newLat, newLon]);
            localStorage.setItem('lat', newLat);
            localStorage.setItem('lng', newLon);
          }
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
            // TODO: DIFFERENT MARKER FOR SELECTED BRIGADE
            // TODO: center the dot-- it's off from the cities
            <Marker
              position={[+b.latitude, +b.longitude]}
              key={b.name}
              icon={myIcon}
            >
              <Popup>
                <div>{b.name}</div>
                <div>{`${b.projects.length}`}</div>
                {b.name !== selectedBrigadeName ? (
                  <Button
                    onClick={() => setFilterOpts({ selectedBrigade: b })}
                    type="button"
                    text={`Show only ${b.name} projects`}
                    linkButton
                  />
                ) : (
                  <>
                    <div>{`Showing only ${b.name} projects`}</div>
                    <Button
                      onClick={() => setFilterOpts({})}
                      type="button"
                      text="Show all projects"
                      linkButton
                    />
                  </>
                )}
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
          localStorage.setItem('zoom', defaultZoom);
          localStorage.setItem('lat', defaultCenter[0]);
          localStorage.setItem('lng', defaultCenter[1]);
          setFilterOpts({});
        }}
        text="Reset"
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
