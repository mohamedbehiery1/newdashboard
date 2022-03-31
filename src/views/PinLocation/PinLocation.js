import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
// import { GpsFixedTwoTone } from "@material-ui/icons";
import { LoadingButton } from "@material-ui/lab";
import { Helmet } from "react-helmet";
import { $APP_NAME } from "src/constants";
import { useTranslation } from 'react-i18next';
import { MapItTextField } from "src/components/common";
import { get, set, pick, cloneDeep, find, includes, forEach } from 'lodash';
import { validationSchema } from './ValidationSchema';
import runJoiValidate from "src/__utils__/runJoiValidate";
import { useLocation } from 'react-router-dom';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import HttpService from "src/__services__/httpService";
import Logo from "src/components/Logo";
import generateCloudinaryLink from 'src/__utils__/generateCloudinaryLink';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwaXRhcHAiLCJhIjoiY2tvN2s0bzh0MXduajJ4bHBkOHhkdncwMyJ9.dYrI7DfoQuXfyIofEsifbQ';

const useStyles = makeStyles((theme) => ({
  cardContent: {
    padding: "0 !important",
    '&:last-child': {
      paddingBottom: "0 !important",
    },
  },
}));

const mapStyles = {
  streets: "mapbox://styles/mapbox/streets-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v11",
  // "mapbox://styles/mapbox/satellite-v9"
}

const PinLocation = ({ ...props }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  // const { lang } = useParams();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [pending, setPending] = useState(false);
  const [mapStyle, setMapStyle] = useState(mapStyles.satellite)
  const [mapListenerSet, setMapListenerSet] = useState(false);

  const toggleMapStyle = _ => {
    if (!map.current) return
    if (mapStyle === mapStyles.satellite) {
      setMapStyle(mapStyles.streets);
      map.current.setStyle(mapStyles.streets);
    }
    if (mapStyle === mapStyles.streets) {
      setMapStyle(mapStyles.satellite);
      map.current.setStyle(mapStyles.satellite);
    }
  }

  const mapContainer = useRef(null);
  const map = useRef(null);
  let marker = new mapboxgl.Marker()

  const [state, setState] = useState({ address: {}, location: [] });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [waitingData, setWaitingData] = useState(true);
  const [color, setColor] = useState();
  const [logo, setLogo] = useState();
  const [isRecordFound, setIsRecordFound] = useState(true);

  useEffect(() => {
    getPageData()
    // Language
    const lang = urlParams.get('lang');
    i18n.changeLanguage(lang);
  }, [])

  useEffect(() => {
    if (waitingData) return;
    if (map.current) return;
    if (!mapContainer.current) return;
    const lnglat = [46.663077, 24.727627]
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/mapbox/satellite-v9',
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: mapStyle,
      center: lnglat,
      zoom: 16
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // trackUserLocation: true
      })
    );
    map.current.setCenter(lnglat);
    marker.setLngLat(lnglat).addTo(map.current);
    // Location
    markCurrentLocation(0);
  });

  useEffect(() => {
    if (waitingData) return;
    if (mapListenerSet || !map.current) return;
    map.current.on('click', function (e) {
      const location = [
        e.lngLat.lng,
        e.lngLat.lat
      ]
      marker.setLngLat(location)
      setState({
        ...state,
        location
      });
    });
    setMapListenerSet(true);
  });

  const handleChange = (event) => {
    const details = { ...state };
    set(details, event.target.name, event.target.value)
    setState({
      ...details
    });
  };

  const markCurrentLocation = timeout => {
    navigator.geolocation.getCurrentPosition(position => {
      const location = [
        position.coords.longitude,
        position.coords.latitude
      ]

      setState({
        ...state,
        location
      })

      setTimeout(_ => {
        map.current.setCenter(location);
        marker.setLngLat(location);
      }, timeout);
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    // Pick Params
    let paramsToPick = ["address", "location"]
    let details = pick(
      cloneDeep(state),
      paramsToPick
    );
    // const addressComps = await getAddressComponents(details.location[1], details.location[0]);
    // details.address = { ...details.address, ...addressComps };
    console.log(details)
    // Validate
    const validationErrors = runJoiValidate(validationSchema, details);
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    addAddress(details);
  };

  const addAddress = async (addressDetails) => {
    setPending(true);
    setError("");
    let type;
    if (urlParams.get('token')) type = 'token';
    if (urlParams.get('orderId')) type = 'orderId';

    const params = {
      [type]: urlParams.get(type),
      ...addressDetails.address,
      location: addressDetails.location,
    }

    try {
      const response = await HttpService.request({
        url: `${apiUrl}/v1/merchant/address`,
        data: params,
        method: type === 'token' ? 'post' : 'put'
      })
      const { body: url } = response.data
      if (type === 'token') window.location.href = url;
      if (type === 'orderId') setSuccess(true);
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
        e.response.data.message && setError(e.response.data.message);
      }
    } finally {
      setPending(false);
    }
  }

  const getAddressComponents = async (latitude, longitude) => {
    try {
      const response = await HttpService.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAc_em768hTcaSQKhb0UXVUo_GGKJpNRG8`,
        {
          transformRequest: (data, headers) => {
            delete headers.common['Authorization'];
            return data;
          }
        }
      )
      const { results: addressComponents } = response.data;

      const extractAddressComponents = (address, components) => {
        let extractedComponents = {};
        forEach(components, comp => {
          const extractedComponent = find(address, (component => includes(component.types, comp)));
          if (extractedComponent)
            set(extractedComponents, comp, extractedComponent.address_components[0].long_name);
          else
            set(extractedComponents, comp, null);
        })
        return extractedComponents;
      }

      const extractedAddressComponents = extractAddressComponents(
        addressComponents,
        [
          "administrative_area_level_1",

          "locality",
          "administrative_area_level_2",

          "sublocality",
          "neighborhood",
          "administrative_area_level_3",

          "route",
          "street_address"
        ]
      )

      return {
        city: extractedAddressComponents['locality'] || extractedAddressComponents['administrative_area_level_2'] || "Unknown City",
        area: extractedAddressComponents['sublocality'] || extractedAddressComponents['neighborhood'] || extractedAddressComponents['administrative_area_level_3'] || "Unknown Area",
        street: extractedAddressComponents['route'] || extractedAddressComponents['street_address'] || "Unknown Street",
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getPageData = async _ => {
    let url = `${apiUrl}/v1/merchant/location-url-data?`
    if (urlParams.get('token')) {
      url = url + "token=" + urlParams.get('token')
    }
    if (urlParams.get('orderId')) {
      url = url + "orderId=" + urlParams.get('orderId')
    }
    try {
      const response = await HttpService.get(url)
      const { locationPageLogo, locationPageColor } = response.data.body
      console.log(locationPageColor, locationPageLogo);
      setLogo(locationPageLogo);
      setColor(locationPageColor);
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        const {message} = e.response.data;
        if (message === "Error: Record Not Found") {
          setIsRecordFound(false);
        }
        console.log(e.response.data)
      }
    } finally {
      setWaitingData(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Pin Location | {$APP_NAME}</title>
      </Helmet>
      {
        !waitingData && isRecordFound &&
        (
          success ||
          <React.Fragment>
            <AppBar color="transparent" elevation={0} {...props}>
              <Toolbar style={{ justifyContent: 'center' }}>
                <Logo customSource={logo ? generateCloudinaryLink(logo) : null} logoType="dark" height={50} />
              </Toolbar>
            </AppBar>
            <Box sx={{ display: "flex", bgcolor: color || "#00588C", py: 1, mt: 1, justifyContent: 'center' }} >
              <Typography sx={{ color: 'text.white' }} variant='h5'>{`${t("Pin your location on map")} `}</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "white",
                // minHeight: "100%",
                flexGrow: 1,
                px: 2,
                pt: 3,
              }}
            >
              <Container sx={{ height: "100%", width: "100%" }}>
                <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Card sx={{
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "#C7C7C7",
                        borderRadius: '8px',
                      }}
                      >
                        <CardContent className={classes.cardContent}>
                          <Box ref={mapContainer} sx={{ height: '400px' }}>
                            <Button
                              color="map"
                              variant="contained"
                              disableElevation
                              onClick={toggleMapStyle}
                              // disabled={type === "edit" && state.submitDisabled}
                              sx={{
                                position: "absolute",
                                right: '50px',
                                top: '0px',
                                textTransform: "none",
                                fontWeight: "bold",
                                mt: 2,
                                px: 1.2,
                                py: 0.2,
                                zIndex: 999,
                                borderColor: "#cfcdc9",
                                borderWidth: 0.5,
                                borderRadius: 1,
                                borderStyle: "solid"
                              }}
                            >
                              {t(mapStyle === mapStyles.satellite ? "Street View" : "Satellite View")}
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                      {/* <Button
                  color="main"
                  variant="contained"
                  disableElevation
                  onClick={handleCurrentLocationClick}
                  // pending={pendingSubmit}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    my: 2,
                    px: 1.5,
                  }}
                >
                  <GpsFixedTwoTone sx={{ marginInlineEnd: 8 }} />
                  {t("Current Location")}
                </Button> */}
                    </Grid>
                    <Grid item xs={12} mt={3}>
                      <Grid container justify="center" spacing={3}>
                        <Grid item xs={12}>
                          <MapItTextField
                            label={t("House Number")}
                            name="address.houseNumber"
                            value={get(state, "address.houseNumber") || ""}
                            required={true}
                            handleChange={handleChange}
                            error={get(state, "validationErrors.address.houseNumber")}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <MapItTextField
                            label={t("Floor")}
                            name="address.floor"
                            value={get(state, "address.floor") || ""}
                            required={true}
                            handleChange={handleChange}
                            error={get(state, "validationErrors.address.floor")}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <MapItTextField
                            label={t("Flat")}
                            name="address.flat"
                            value={get(state, "address.flat") || ""}
                            required={true}
                            handleChange={handleChange}
                            error={get(state, "validationErrors.address.flat")}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <MapItTextField
                            label={t("Note")}
                            name="address.landmark"
                            value={get(state, "address.landmark") || ""}
                            required={true}
                            handleChange={handleChange}
                            error={get(state, "validationErrors.address.landmark")}
                            size="small"
                            // color={color || "00588c"}
                            // InputLabelProps={{
                            //   sx: {
                            //     color: color || "00588c",
                            //   },
                            // }}
                            // color={null}
                            sx={{
                              borderColor: color || "00588c"
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: error ? "space-between" : "flex-end",
                          alignItems: 'center',
                        }}
                      >
                        {error && <Typography color='text.danger'>{t(error)}</Typography>}
                        <Box>
                          <LoadingButton
                            // color={color || "main"}
                            variant="contained"
                            disableElevation
                            type="submit"
                            loading={pending}
                            // disabled={type === "edit" && state.submitDisabled}
                            sx={{
                              textTransform: "none",
                              fontWeight: "bold",
                              mt: 2,
                              px: 1.5,
                              backgroundColor: color || "#00588c",
                              ":hover": {
                                backgroundColor: color || "#00588c",
                              }
                            }}
                          >
                            {t("Continue")}
                          </LoadingButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Container>
            </Box>
          </React.Fragment>
        )
      }
      {
        !waitingData && isRecordFound &&
        (
          success &&
          <Container sx={{ height: "100%", width: "100%", pt: 12 }}>
            <Typography color="success.main" variant="h3" sx={{ textAlign: 'center' }}>
              {t("Location Successfully Pinned")}
            </Typography>
          </Container>
        )
      }
      {
        !waitingData && isRecordFound &&
        (
          success ||
          <Box
            display="flex"
            flexDirection="row"
            bgcolor="#F2F2F2"
            py="10px"
            mt={3}
            width="100%"
            justifyContent="center"
          // marginTop="auto"
          >
            <label style={{ color: "#c7c7c7", fontSize: 16 }}>
              Powered by {$APP_NAME}
            </label>
          </Box>
        )
      }
            {
        isRecordFound ||
        <Container sx={{ height: "100%", width: "100%", pt: 12 }}>
          <Typography color="success.main" variant="h3" sx={{ textAlign: 'center' }}>
            {t("Order not found")}
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            bgcolor="#F2F2F2"
            py="10px"
            mt={3}
            width="100%"
            justifyContent="center"
            sx={{position: 'absolute', left: 0, right: 0, bottom: 0}}
          >
            <label style={{ color: "#c7c7c7", fontSize: 16 }}>
              Powered by {$APP_NAME}
            </label>
          </Box>
        </Container>
      }
    </>
  );
};

export default PinLocation;
