import React, { useRef, useEffect, useState } from "react";
import {
    IconButton,
    Container,
    Box,
    Card,
    CardHeader,
    Typography,
    CardContent
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import {
    DoubleArrowRounded,
    PinDropRounded,
    PhoneRounded,
    DirectionsRounded
} from "@material-ui/icons";
import { $APP_NAME } from "src/constants";
import { useParams } from 'react-router-dom';
import OrderService from 'src/__services__/orderService';
import { useTranslation } from "react-i18next";
import { join, forEach, map as _map } from 'lodash';
import moment from "moment";
import 'moment/locale/ar';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import CustomIcon from "src/components/CustomIcon";
import generateCloudinaryLink from 'src/__utils__/generateCloudinaryLink';
import { Logo } from "src/components";
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from "@material-ui/lab";
import { Helmet } from "react-helmet";
import HttpService from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

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
}));

const EndOrder = () => {

    const mapContainer = useRef(null);
    const map = useRef(null);
    let marker = new mapboxgl.Marker({ color: '#FAB707' })
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [pending, setPending] = useState(false);

    const classes = useStyles();
    const params = useParams();

    const [order, setOrder] = useState(null);

    const AddressComponents = ({ address }) => {
        const addressComponents = [
            t("formattedAddress.addressLineOne", { address }),
            t("formattedAddress.addressLineTwo", { address }),
            t("formattedAddress.addressExtra", { address })
        ]
        return (
            <Box pb={0}>
                <Typography px={0.5} display='block' variant='body2'>
                    {join(addressComponents, " ")}
                </Typography>
            </Box>
        )
    }

    const UserContactDetails = ({ user }) => (
        <Box display='flex' flexDirection='column' >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                <Typography variant='body2'> {`${t("Client")}:`} </Typography>
                <Typography mx={0.4} variant='h6'> {user.name} </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                <Typography variant='body2'> {`${t("Phone")}:`} </Typography>
                <Typography textAlign='left' mx={0.4} variant='h6'> {`${user.phoneCode}${user.phone}`} </Typography>
            </Box>
        </Box>
    )

    useEffect(async _ => {
        try {
            const { data } = await OrderService.getOrder('driver', params.id);
            const orderDetails = data.body
            setOrder(orderDetails)
        } catch (e) {
            console.log(e);
        }
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

    const handleZoneClick = _ => navigate(`/driver/zone`, { replace: true })
    const handleEndOrderClick = async _ => {
        setPending(true)
        try {
            const { data } = await HttpService.get(`${apiUrl}/v1/driver/order`)
            navigate('/driver/zone', { replace: true })
        } catch (e) {
            console.log(e);
        }
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
                        flexDirection="row"
                        bgcolor="#F2F2F2"
                        px='8%'
                        py={0.5}
                    >
                        <Box component="span" flexGrow="1">
                            <Typography display='inline-block' variant='body2'>{`${t("Order Number")} `}</Typography>
                            <Typography sx={{ marginInlineStart: 2.5 }} display='inline-block' variant='h5'>{order && order.orderNumber}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleZoneClick} component="span">
                            <Typography display='inline-block' variant='body2'>{`${t("Zone")} `}</Typography>
                            <Typography sx={{ marginInlineStart: 2.5 }} display='inline-block' variant='h5'>{order && order.zone.name}</Typography>
                            <DoubleArrowRounded sx={{ marginInlineStart: 5, fontSize: 20, transform: i18n.dir() === 'rtl' ? 'scale(-1, 1)' : '' }} />
                        </Box>
                    </Box>
                    <Box ref={mapContainer} display="flex" width="100%" height="250px" justifyContent="center" />
                    {
                        order &&
                        <Card className={classes.root}>
                            <CardHeader
                                sx={{ py: 1.2 }}
                                avatar={
                                    <CustomIcon sx={{ fontSize: 24 }} type='address' />
                                }
                                action={
                                    <IconButton sx={{ p: 0, m: 0, mt: 'auto' }} aria-label="navigation">
                                        <a style={{ height: 36, width: 36 }} href={`https://www.google.com/maps/search/?api=1&query=${order.user.location.coordinates[1]},${order.user.location.coordinates[0]}`}>
                                            <CustomIcon sx={{ fontSize: 36 }} type='navigation' />
                                        </a>
                                    </IconButton>
                                }
                                title={<AddressComponents address={order.user.address}></AddressComponents>}
                            >
                            </CardHeader>
                            <CardContent className={classes.cardContent}>
                            </CardContent>
                        </Card>
                    }
                    {
                        order &&
                        <Box sx={{ width: '100%', height: '100px', mt: '-32px', mb: '-24px' }} >
                            <Box sx={{ display: 'flex', flexDirection: 'row', px: '9%', alignItems: 'center' }}>
                                <CustomIcon sx={{ fontSize: 24 }} type='dropoff' />
                                <Box flexGrow={1} sx={{ px: 2 }}>
                                    <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("Delivered to")} </Typography>
                                    <Typography sx={{ color: '#767676', mt: -1.1 }} variant='h4'>
                                        {order.user.name}
                                    </Typography>
                                </Box>
                                <IconButton sx={{ p: 0, m: 0, }} aria-label="call">
                                    <a href={`tel:${order.user.phoneCode + order.user.phone}`}>
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
                                <Typography sx={{ color: '#767676', mt: -1.1 }} gutterBottom variant='h4'> {order.merchant.companyName} </Typography>
                            </Box>
                            <Box mt={-0.8}>
                                <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("Order Items")} </Typography>
                                <Typography sx={{ color: '#767676', mt: -1.1 }} gutterBottom variant='h4'> {`${join(order.orderItems, " - ")}`} </Typography>
                            </Box>
                            <Box mt={-0.8}>
                                <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("COD (Cash On Delivery)")} </Typography>
                                <Typography sx={{ color: '#767676', mt: -1.1 }} gutterBottom variant='h4'>
                                    {order.amountPayable ? `${order.amountPayable} ${t("Currency")}` : t("Paid")}
                                </Typography>
                            </Box>
                            <Box mt={-0.8}>
                                <Typography sx={{ color: '#c7c7c7' }} variant='subtitle2'> {t("Order Date")} </Typography>
                                <Typography sx={{ color: '#767676', mt: -1.1 }} gutterBottom variant='h4'>
                                    {moment(order.createdAt).format("DD/MM/YYYY - hh:mm a")}
                                </Typography>
                            </Box>
                            <Box mt={-0.8}>
                                <LoadingButton
                                    color="main"
                                    variant="contained"
                                    disableElevation
                                    // onClick={handleEndOrderClick}
                                    loading={pending}
                                    sx={{
                                        mt: 1,
                                        textTransform: "none",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {t("End Order")}
                                </LoadingButton>
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
            </Container>
        </>
    );
};

export default EndOrder;
