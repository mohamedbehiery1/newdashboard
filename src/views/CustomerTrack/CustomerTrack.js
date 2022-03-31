import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  CardHeader,
  Typography,
  IconButton
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { $APP_NAME } from "src/constants";
import { useParams } from 'react-router-dom';
import OrderService from 'src/__services__/orderService';
import { useTranslation } from "react-i18next";
import { join, map as _map, has } from 'lodash';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import CustomIcon from "src/components/CustomIcon";
import generateCloudinaryLink from 'src/__utils__/generateCloudinaryLink';
import { Logo, OrderItem } from "src/components";
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from "moment";
import 'moment/locale/ar';
import socketIO from 'socket.io-client';
// import WhatsappDialog from "./WhatsappDialog"

import { $BASE_URL } from "src/constants";

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwaXRhcHAiLCJhIjoiY2tvN2s0bzh0MXduajJ4bHBkOHhkdncwMyJ9.dYrI7DfoQuXfyIofEsifbQ';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "90%",
    marginInlineStart: "5%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#f9b02a",
    borderRadius: 4,
    position: "relative",
    top: "-40px",
    zIndex: 999,
  },
  logo: {
    width: 70,
  },
  cardContent: {
    padding: "0 !important",
    '&:last-child': {
      paddingBottom: "0 !important",
    },
  },
  textfieldRoot: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
  }
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CustomerTrack = () => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  let marker = new mapboxgl.Marker({ color: '#FAB707' })
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const classes = useStyles();
  const params = useParams();

  const [order, setOrder] = useState(null);

  // Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setDeliveryNotes(""); setDeliverySuccessful(true) };
  const [deliverySuccessful, setDeliverySuccessful] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState("");

  // const [whatsappDialogOpen, setWhatsappDialogOpen] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState();

  // const handleOpenWhatsappDialog = () => {
  //   setWhatsappDialogOpen(true);
  // };

  // const handleWhatsappDialogClose = (value) => {
  //   setWhatsappDialogOpen(false);

  //   if (value || value === "")
  //     window.open(`whatsapp://send?phone=${order.user.phoneCode + order.user.phone}&text=${value}`)
  // };

  const [driver, setDriver] = useState();
  const driverRef = useRef(driver);

  const socket = socketIO(
    $BASE_URL,
    {
      transports: ['websocket'], jsonp: false
    }
  );

  useEffect(_ => {
    if (order && order.id) {
      initializeSocketIOClient(order.id)
    }
  }, [order])

  const initializeSocketIOClient = id => {
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
    // let driver = find(driversRef.current, driver => driver.id === id);
    if (!!driverRef.current) {
      // if driver exists, just update marker latlng
      driverRef.current.marker.setLngLat([data.location.longitude, data.location.latitude])
    } else {
      // if driver doesn't exist, add to array
      let mydriver = {
        id,
        name: data.driverId.name,
        location: data.location,
      }

      var markerContent = document.createElement('img');
      markerContent.height = 40;
      markerContent.src = "/static/driver-pin.png"

      const driverLngLat = [mydriver.location.longitude, mydriver.location.latitude]
      const marker = new mapboxgl.Marker(markerContent, { anchor: "bottom" })
        .setLngLat(driverLngLat)
        .addTo(map.current)

      mydriver.marker = marker;
      driverRef.current = mydriver;
      setDriver(mydriver);

      setTimeout(
        _ => fitMapToPoints(
          driverLngLat,
          order.user.location.coordinates
        ),
        1000
      );
    }
  }

  const getBounds = (...points) => {
    const bounds = [
      [Math.min(points[0][0], points[1][0]), Math.min(points[0][1], points[1][1])],
      [Math.max(points[0][0], points[1][0]), Math.max(points[0][1], points[1][1])]
    ]
    return bounds
  }

  const fitMapToPoints = (...points) => {
    const bounds = getBounds(...points);
    map.current.fitBounds(
      bounds,
      {
        padding: { top: 64, bottom: 64, left: 32, right: 32 },
        linear: true
      }
    )
  }

  const whatsappButtonClicked = () => {
    window.open(`whatsapp://send?phone=${order.driver.phoneCode + order.driver.phone}`)
  };

  const AddressComponents = ({ address }) => {
    const addressComponents = [
      t("formattedAddress.addressLineOne", { address }),
      t("formattedAddress.addressLineTwo", { address }),
      // t("formattedAddress.addressExtra", { address })
    ]
    return (
      <Box pb={0}>
        <Typography px={0.5} display='block' variant='body2'>
          {join(addressComponents, " ")}
        </Typography>
      </Box>
    )
  }

  const loadShipmentDetails = async _ => {
    try {
      const { data } = await OrderService.getOrder('user', params.id);
      const orderDetails = data.body
      setOrder(orderDetails)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(_ => {
    loadShipmentDetails();
  }, [])

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [46.663077, 24.727627],
        zoom: 11
      });
    }
    console.log(order)
    if (!order) return
    setTimeout(_ => {
      marker.setLngLat(order.user.location.coordinates).addTo(map.current);
      map.current.setCenter(order.user.location.coordinates);
    }, 500)
  }, [order]);

  const getOrderItems = orderItems => {
    if (!orderItems) return;
    let { ...items } = orderItems
    if (items && has(items[0], 'item')) {
      items = map(items, item => `${item.amount} ${item.item}`)
    }
    return `${join(items, " - ")}`
  }

  return (
    <>
      <Helmet>
        <title>Track | {$APP_NAME}</title>
      </Helmet>
      <Container disableGutters={true}>
        <Box flex-direction="column">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#F2F2F2"
            px='8%'
            py={0.5}
          >
            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography display='inline-block' variant='body2'>{`${t("Order Number")} `}</Typography>
              <Typography sx={{ marginInlineStart: 2.5 }} display='inline-block' variant='h5'>{order && order.orderNumber}</Typography>
            </Box>
          </Box>
          <Box ref={mapContainer} display="flex" width="100%" height="250px" justifyContent="center" />
          {
            order &&
            <Card className={classes.root}>
              <CardHeader
                sx={{ py: 1.2 }}
                avatar={<CustomIcon sx={{ fontSize: 24 }} type='address' />}
                title={<AddressComponents address={order.user.address} />}
              >
              </CardHeader>
            </Card>
          }
          {
            order && order.driver &&
            <Box sx={{ width: '100%', height: '100px', mt: '-32px', mb: '-24px' }} >
              <Box sx={{ display: 'flex', flexDirection: 'row', px: '9%', alignItems: 'center' }}>
                <CustomIcon sx={{ fontSize: 24 }} type='dropoff' />
                <Box flexGrow={1} sx={{ px: 2 }}>
                  <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("Delivered by")} </Typography>
                  <Typography sx={{ color: '#767676', mt: -1.1 }} variant='h4'>
                    {order.driver.name}
                  </Typography>
                </Box>
                <IconButton
                  onClick={whatsappButtonClicked}
                  sx={{ p: 0, m: 0, marginInlineEnd: '12px' }}
                >
                  <CustomIcon sx={{ fontSize: 24 }} type='whatsapp' />
                </IconButton>
                <IconButton sx={{ p: 0, m: 0, }} aria-label="call">
                  <a href={`tel:${order.driver.phoneCode + order.driver.phone}`}>
                    <CustomIcon sx={{ fontSize: 24 }} type='call' />
                  </a>
                </IconButton>
              </Box>
              <Box sx={{ width: '100%', height: '2px', bgcolor: '#DCDCDC' }} mt='8px' />
            </Box>
          }
          {
            order &&
            <Box sx={{ width: '80%', mx: '10%' }} pb={8} >
              <Box mt={-0.8}>
                <Logo customSource={generateCloudinaryLink(order.merchant.logo)} />
              </Box>
              <Box mt={-0.8}>
                <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("Merchant")} </Typography>
                <Typography sx={{ color: '#767676', mt: -0.5 }} gutterBottom variant='h6'> {order.merchant.companyName} </Typography>
              </Box>
              <Box mt={-0.8}>
                <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("Order Items")} </Typography>
                <Box sx={{ color: '#767676', mt: -0.5, mb: 0.80 }}>
                  {
                    order.orderItems && _map(
                      order.orderItems,
                      item => (
                        <OrderItem key={item._id} size="small" item={item} />
                      )
                    )
                  }
                </Box>
              </Box>
              <Box mt={-0.8}>
                <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("COD (Cash On Delivery)")} </Typography>
                <Typography sx={{ color: '#767676', mt: -0.5 }} gutterBottom variant='h6'>
                  {order.amountPayable ? `${order.amountPayable} ${t("Currency")}` : t("Paid")}
                </Typography>
              </Box>
              <Box mt={-0.8}>
                <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("Order Date")} </Typography>
                <Typography sx={{ color: '#767676', mt: -0.5 }} gutterBottom variant='h6'>
                  {moment(order.createdAt).format("DD/MM/YYYY - hh:mm a")}
                </Typography>
              </Box>
              <Box mt={-0.8}>
                <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("Status")} </Typography>
                <Typography sx={{ color: '#767676', mt: -0.5 }} gutterBottom variant='h6'>
                  {t(order.currentStatus)}
                </Typography>
              </Box>
            </Box>
          }
          <Box
            display="flex"
            flexDirection="row"
            bgcolor="#F2F2F2"
            py="10px"
            position="absolute"
            bottom="0"
            width="100%"
            justifyContent="center"
            marginTop="auto"
          >
            <label style={{ color: "#c7c7c7", fontSize: 16 }}>
              All Rights Reserved. {$APP_NAME}
            </label>
          </Box>
        </Box>
        {
          // <WhatsappDialog 
          // driverName={driverName}
          // merchantName={order ? order.merchant.companyName : ""}
          // /*selectedValue={selectedValue}*/
          // open={whatsappDialogOpen}
          // onClose={handleWhatsappDialogClose}
          // />
        }
      </Container>
    </>
  );
};

export default CustomerTrack;
