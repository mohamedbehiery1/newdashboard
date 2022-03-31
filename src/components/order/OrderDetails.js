import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import AddOrderItem from './AddOrderItem';
import AddLocationLink from './AddLocationLink';
import OrderItem from './OrderItem';
import { LoadingButton } from "@material-ui/lab";
import { MapItTextField } from "src/components/common";
import { isEmpty, pick, omit, set, unset, get, cloneDeep, concat, filter, map as _map, includes, startsWith } from 'lodash';
import parsePhoneNumber from 'libphonenumber-js';
import OrderMerchantDetails from "./OrderMerchantDetails";
import { adminSchema, merchantSchema, shippingCompanySchema } from './ValidationSchemas';
import runJoiValidate from "src/__utils__/runJoiValidate";
import OrderShipmentDetails from "./OrderShipmentDetails";
import AuthService from "src/__services__/AuthService";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import ZoneOrderListDriver from 'src/views/ZoneOrderList/components/ZoneOrderListDriver';
import { OrderSubmerchantDetails } from 'src/views/Submerchants/components';
import MapitPhoneInput from "src/components/common/MapitPhoneInput";

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwaXRhcHAiLCJhIjoiY2tvN2s0bzh0MXduajJ4bHBkOHhkdncwMyJ9.dYrI7DfoQuXfyIofEsifbQ';


const OrderDetails = ({
  type,
  orderDetails,
  handleSubmit,
  pendingSubmit,
  handleDelete,
  pendingDelete,
  handleAssignDriver,
  pendingAssignDriver,
  error,
  success,
  assignDriverError,
  assignDriverSuccess,
  ...props
}) => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [marker, setMarker] = useState(new mapboxgl.Marker());
  const [mapListenerSet, setMapListenerSet] = useState(false);

  const { t } = useTranslation();
  const { role, roleType } = AuthService.getCurrentUser();

  const [state, setState] = useState({ orderDetails: { packagesCount: 1, user: { address: {} }, } });
  const [location, setLocation] = useState();

  useEffect(() => {
    let order = pick(
      cloneDeep(orderDetails),
      [
        'merchant',
        'subMerchant',
        'user',
        'amountPayable',
        'orderItems',
        'driver',
        'currentStatus',
        'barCode',
        'packagesCount'
      ]
    );

    if (type === "edit" && order.user) {
      order.user.phone = getPhoneNumber(orderDetails.user.phoneCode, orderDetails.user.phone);
      if (order.user.location && order.user.location.coordinates) {
        const location = order.user.location.coordinates;
        setLocation(location)
        if (!isEmpty(order.user.location.coordinates)) {
          map.current.setCenter(location);
          setMarker(marker.setLngLat(location).addTo(map.current));
        }
      }
      order.merchant = order.merchant.id
    }

    if (type === "add") {
      order = { ...state.orderDetails };
    }

    if (type === "edit" && role === "merchant" && roleType === "SHIPPING_COMPANY" && order.subMerchant) {
      order.subMerchant = order.subMerchant.id;
    }

    order.user = omit(order.user, ['phoneCode'])

    setState({
      ...state,
      submitDisabled: isEmpty(orderDetails),
      orderDetails: order
    })
  }, [orderDetails])

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [46.663077, 24.727627],
      zoom: type === "add" ? 9 : 16
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(new mapboxgl.GeolocateControl());
    // if (type === 'add') {
    //   map.current.setCenter(state.orderDetails.user.location);
    //   setMarker(marker.setLngLat(state.orderDetails.user.location).addTo(map.current));
    // }
  });

  useEffect(() => {
    if (mapListenerSet || !map.current) return;
    map.current.on('click', e => setMarkerLngLat(e.lngLat));
    setMapListenerSet(true);
  });

  const onAddLocation = coords => {
    const ll = new mapboxgl.LngLat(coords[0], coords[1]);
    setMarkerLngLat(ll);
    map.current.easeTo({ center: ll, zoom: 16, duration: 500 });
  }

  const setMarkerLngLat = lngLat => {
    marker.setLngLat(lngLat)
    if (!location) {
      marker.addTo(map.current);
    }
    setMarker(marker);
    setLocation([lngLat.lng, lngLat.lat])
  }

  const getPhoneNumber = (phoneCode, phone) => {
    let phoneNumberString = phoneCode + phone;
    if (!startsWith(phoneCode, "+")) phoneNumberString = "+" + phoneNumberString;
    const phoneNumber = parsePhoneNumber(phoneNumberString, { extract: true })
    if (phoneNumber) return phoneNumber.format('E.164')
  }

  const handleChange = (event) => {
    const details = { ...state.orderDetails };
    console.log(`isNAN "${event.target.value}"`, isNaN(Number(event.target.value)));
    if (includes(['amountPayable', 'packagesCount'], event.target.name) && isNaN(event.target.value)) return
    if (event.target.name === 'amountPayable' && event.target.value == "0") {
      unset(details, 'amountPayable')
    } else {
      set(details, event.target.name, event.target.value)
    }
    // if (event.target.name === 'packagesCount' && event.target.value == "0") {
    //   unset(details, 'amountPayable')
    // } else {
    //   set(details, event.target.name, event.target.value)
    // }
    setState({
      ...state,
      orderDetails: {
        ...details
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Pick Params
    let paramsToPick = ["user", "amountPayable", "orderItems", "packagesCount"]
    if (role === "admin") paramsToPick.unshift("merchant");
    if (roleType === "SHIPPING_COMPANY") paramsToPick.unshift("subMerchant");
    let order = pick(
      cloneDeep(state.orderDetails),
      paramsToPick
    );

    order.orderItems = _map(order.orderItems, item => omit(item, '_id'));
    if (location) order.user.location = location;
    // Define Schema
    const schema = role === "admin" ? adminSchema : roleType === "SHIPPING_COMPANY" ? shippingCompanySchema : merchantSchema;

    // Validate
    const validationErrors = runJoiValidate(schema, order);
    console.log(order);
    console.log("Validation Errors", validationErrors);
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    // Process
    const parsedPhone = parsePhoneNumber(state.orderDetails.user.phone, { extract: true })
    order.user.phoneCode = `+${parsedPhone.countryCallingCode}`;
    order.user.phone = parsedPhone.nationalNumber;
    const amountPayableAsNumber = Number(order.amountPayable);
    order.amountPayable = amountPayableAsNumber ? amountPayableAsNumber : 0;
    const packagesCountAsNumber = Number(order.packagesCount);
    order.packagesCount = packagesCountAsNumber ? packagesCountAsNumber : 0;
    handleSubmit(order);
  };

  const onDelete = _ => {
    handleDelete(orderDetails.id)
  }

  const handleAddItem = item => {
    const newItem = { _id: `${item.count}*${item.description}`, item: item.description, amount: item.count };
    const oldItems = cloneDeep(state.orderDetails.orderItems) || [];
    const newItems = concat(oldItems, newItem);
    handleChange({
      target: {
        name: 'orderItems',
        value: newItems
      }
    })
  }

  const handleRemoveItem = id => {
    const newItems = filter(state.orderDetails.orderItems, item => item._id != id)
    handleChange({
      target: {
        name: 'orderItems',
        value: newItems
      }
    })
  }

  const handleClearSubmerchant = _ => {
    const details = { ...state.orderDetails };
    set(details, 'subMerchant', null);
    setState({ ...state, orderDetails: { ...details } });
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Grid container spacing={3}>
        {
          role === 'admin' &&
          <Grid item xs={12}>
            <OrderMerchantDetails
              type={type}
              merchant={state.orderDetails.merchant}
              handleChange={handleChange}
              error={state.validationErrors && state.validationErrors.merchant}
            />
          </Grid>
        }
        {
          role === 'merchant' &&
          type === 'edit' &&
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t("Assigned Driver")} />
              <Divider />
              <CardContent>
                <Grid container justify="center" spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ZoneOrderListDriver
                      handleSubmit={handleAssignDriver}
                      pending={pendingAssignDriver}
                      driverId={get(state.orderDetails.driver, "id")}
                      disabled={state.orderDetails.currentStatus && includes(["ORDER_COMPLETED", "ORDER_FAILED"], state.orderDetails.currentStatus)}
                    />
                    {assignDriverError && <Typography mt={2} mx={1} color='text.danger'>{t(assignDriverError)}</Typography>}
                    {assignDriverSuccess && <Typography mt={2} mx={1} color='success.main'>{assignDriverSuccess}</Typography>}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        }
        {
          role === 'merchant' && roleType === 'SHIPPING_COMPANY' &&
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t("Merchant Info")}>
              </CardHeader>
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} flexDirection={"row"}>
                    <OrderSubmerchantDetails
                      submerchant={state.orderDetails.subMerchant}
                      handleChange={handleChange}
                      onClearClicked={handleClearSubmerchant}
                      error={state.validationErrors && state.validationErrors.subMerchant}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        }
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t("COD (Cash On Delivery)")} />
            <Divider />
            <CardContent>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("COD (Cash On Delivery)")}
                    name="amountPayable"
                    value={get(state, "orderDetails.amountPayable") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.amountPayable")}
                    type='number'
                    size="small"
                    sx={{
                      'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                        'WebkitAppearance': 'none',
                        margin: 0,
                      },
                      'input[type=number]': {
                        'MozAppearance': 'textfield',
                      }
                    }}
                    inputProps={{
                      min: 0,
                      onKeyDown: (evt) => includes(['e', '+', '-', '.'], evt.key) && evt.preventDefault()
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t("Package Count")} />
            <Divider />
            <CardContent>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Package Count")}
                    name="packagesCount"
                    value={get(state, "orderDetails.packagesCount") || ""}
                    required={true}
                    handleChange={type === "add" && handleChange }
                    error={get(state, "validationErrors.packagesCount")}
                    type='number'
                    size="small"
                    sx={{
                      'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                        'WebkitAppearance': 'none',
                        margin: 0,
                      },
                      'input[type=number]': {
                        'MozAppearance': 'textfield',
                      }
                    }}
                    inputProps={{
                      min: 1,
                      onKeyDown: (evt) => includes(['e', '+', '-', '.'], evt.key) && evt.preventDefault()
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t("Order Items")} />
            <Divider />
            <CardContent>
              <Grid container justify="center">
                {
                  state.orderDetails &&
                  state.orderDetails.orderItems &&
                  <Grid item xs={12} md={6}>
                    {
                      state.orderDetails.orderItems.length > 0
                        ?
                        _map(
                          state.orderDetails.orderItems,
                          item => <OrderItem key={item._id} item={item} handleRemove={handleRemoveItem} deletable={type === "add"} />
                        )
                        :
                        <Typography fontSize={16} color='text.primary'>{t("Order items not available")}</Typography>
                    }
                  </Grid>
                }
                {
                  type === "add" &&
                  <Grid item xs={12}>
                    <AddOrderItem mt={2} handleAdd={handleAddItem} />
                  </Grid>
                }
                {
                  state.validationErrors &&
                  state.validationErrors.orderItems &&
                  <Grid item xs={12}>
                    <Typography fontSize={12} color='text.danger'>{t(state.validationErrors.orderItems)}</Typography>
                  </Grid>
                }
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t("Contact Info")} />
            <Divider />
            <CardContent>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Name")}
                    size="small"
                    name="user.name"
                    value={get(state, "orderDetails.user.name") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.name")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapitPhoneInput
                    label={t("Phone")}
                    name="user.phone"
                    value={get(state, "orderDetails.user.phone")}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.phone")}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t("Address Info")} />
            <Divider />
            <CardContent>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("City")}
                    size="small"
                    name="user.address.city"
                    value={get(state, "orderDetails.user.address.city") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.address.city")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Area")}
                    size="small"
                    name="user.address.area"
                    value={get(state, "orderDetails.user.address.area") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.address.area")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Street")}
                    size="small"
                    name="user.address.street"
                    value={get(state, "orderDetails.user.address.street") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.address.street")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("House Number")}
                    size="small"
                    name="user.address.houseNumber"
                    value={get(state, "orderDetails.user.address.houseNumber") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.address.houseNumber")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Floor")}
                    size="small"
                    name="user.address.floor"
                    value={get(state, "orderDetails.user.address.floor") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.address.floor")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Flat")}
                    size="small"
                    name="user.address.flat"
                    value={get(state, "orderDetails.user.address.flat") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.address.flat")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Notes")}
                    size="small"
                    name="user.address.landmark"
                    value={get(state, "orderDetails.user.address.landmark") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.user.address.landmark")}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t("Location Info")} />
            <Divider />
            {
              type === "add" &&
              <>
                <CardContent>
                  <Grid container justify="center" spacing={1}>
                    <Grid item xs={12}>
                      <AddLocationLink handleAdd={onAddLocation} />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
              </>
            }
            <CardContent>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12}>
                  <Box ref={mapContainer} sx={{ height: '400px' }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {
          type === "edit" &&
          <Grid item xs={12}>
            <OrderShipmentDetails details={cloneDeep(orderDetails)} />
          </Grid>
        }
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: error || success ? "space-between" : "flex-end",
              alignItems: 'center',
            }}
          >
            {success && <Typography color='success.main'>{t(success)}</Typography>}
            {error && <Typography color='text.danger'>{t(error)}</Typography>}
            <Box>
              {type === "edit" &&
                <LoadingButton
                  color="danger"
                  variant="contained"
                  disableElevation
                  onClick={onDelete}
                  loading={pendingDelete}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    mx: 3
                  }}
                >
                  {t("Delete Order")}
                </LoadingButton>
              }
              <LoadingButton
                color="main"
                variant="contained"
                disableElevation
                type="submit"
                loading={pendingSubmit}
                disabled={type === "edit" && state.submitDisabled}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {type === "edit" && t("Save")}
                {type === "add" && t("Add")}
              </LoadingButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default OrderDetails;
