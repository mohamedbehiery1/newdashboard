import { useRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Box } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { useTranslation } from 'react-i18next';
import createMap, { mapControls } from 'src/__services__/mapService';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import AuthService from "src/__services__/AuthService";
import socketIO from 'socket.io-client';
import { find, isEmpty } from "lodash";
import DriverDetails from "./components/DriverDetails";

import { $BASE_URL } from "src/constants";

const TrackDrivers = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { i18n } = useTranslation();

  // const [zones, setZones] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const { id } = AuthService.getCurrentUser();
  const [drivers, setDrivers] = useState([]);
  const driversRef = useRef(drivers);

  // apiUrl
  const socket = socketIO(
    $BASE_URL,
    {
      transports: ['websocket'], jsonp: false
    }
  );

  useEffect(_ => {
    initializeSocketIOClient()
  }, [])

  const initializeSocketIOClient = _ => {
    console.log(id);

    socket.on('connect', () => {
      console.log(`Connected to socket server.`);
      socket.emit('register', { userId: id })
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected from socket server.`, reason);
      socket.connect();
    });

    socket.on('change_location', data => handleChangeLocation(data));

    socket.on("connect_error", (error) => {
      console.log(error)
    });

    socket.connect();
  }

  const handleChangeLocation = (data) => {
    console.log(data);
    const { id } = data.driverId;
    let driver = find(driversRef.current, driver => driver.id === id);
    if (!!driver) {
      // if driver exists, just update marker latlng
      driver.marker.setLngLat([data.location.longitude, data.location.latitude])
    } else {
      // if driver doesn't exist, add to array
      driver = {
        id,
        name: data.driverId.name,
        location: data.location,
      }

      const markerHeight = 10;
      const markerRadius = 5;
      const linearOffset = 25;

      var markerContent = document.createElement('img');
      markerContent.height = markerHeight
      markerContent.src = "/static/circle.png"

      var popupContent = document.createElement('div');
      popupContent.innerHTML = "<div>" + driver.name + "</div>";
      popupContent.onclick = _ => {
        // map.current.easeTo({
        //   center: [data.location.longitude, data.location.latitude], zoom: 14, duration: 2000
        // })
        setTimeout(
          _ => setSelectedDriver({ id, name: driver.name }),
          0
        )
      }
      popupContent.style.cssText = 'cursor:pointer;';

      const popupOffsets = {
        'top': [0, 0],
        'top-left': [0, 0],
        'top-right': [0, 0],
        'bottom': [0, -markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius, (markerHeight - markerRadius) * -1],
        'right': [-markerRadius, (markerHeight - markerRadius) * -1]
      };
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: popupOffsets
      })
        .setDOMContent(popupContent)
        .addTo(map.current);

      const marker = new mapboxgl.Marker(markerContent)
        .setLngLat([driver.location.longitude, driver.location.latitude])
        .addTo(map.current)
        .setPopup(popup);
      driver.marker = marker;

      const newDrivers = [
        ...driversRef.current,
        driver
      ]

      driversRef.current = newDrivers;
      setDrivers(newDrivers);
    }
    // setTimeout(this._fitMarkers, 500);
  }

  useEffect(() => {
    if (map.current) return;
    map.current = createMap({
      container: mapContainer.current,
      center: [46.663077, 24.727627],
      zoom: 10
    })
    let position = i18n.dir() === 'rtl' ? "top-left" : "top-right"
    map.current.addControl(mapControls.navigationControl(), position);
    // map.current.addControl(mapControls.geolocationControl(), position);
    // map.current.setPadding({ left: 300, top: 50 });
  });

  const handleDismissDriverDetails = _ => {
    setTimeout(_ => setSelectedDriver({}), 400)
  }

  return (
    <>
      <Helmet>
        <title>Zones | {$APP_NAME}</title>
      </Helmet>
      <Box
        ref={mapContainer}
        sx={{
          bgcolor: "background.default",
          minHeight: "100%",
          // py: 3,
        }}
      >
        <DriverDetails
          type={"add"}
          visible={!isEmpty(selectedDriver)}
          details={selectedDriver}
          handleDismiss={handleDismissDriverDetails}
        />
      </Box>
    </>
  )
};

export default TrackDrivers;
