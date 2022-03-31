import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
} from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { useTranslation } from "react-i18next";
import { map, isEmpty } from 'lodash';
import 'moment/locale/ar';
import httpService from "src/__services__/httpService";
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import ShipmentCard from "./ShipmentCard";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const ZoneShipments = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [zone, setZone] = useState("");
    const [loading, setLoading] = useState(true);

    const loadShipments = async (lat, lng) => {
        try {
            console.log("requesting")
            const { data } = await httpService.get(`${apiUrl}/v1/driver/order?lat=${lat}&lng=${lng}`)
            const { body: orders } = data;
            setOrders(orders);
            if (!isEmpty(orders)) setZone(orders[0].zone.name);
            setLoading(false)
        } catch (e) {
            console.log(e);
            if (e.response) {
                console.log(e.response)
            }
        }
    }

    const getLocation = _ => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            const { latitude, longitude } = coords;
            loadShipments(latitude, longitude);
        });
    }

    useEffect(_ => {
        getLocation();
    }, [])

    const handleOrderDetailsClick = id => navigate(`/driver/track/${id}`, { replace: true })

    return (
        <>
            <Helmet>
                <title>Zone | {$APP_NAME}</title>
            </Helmet>
            <Container sx={{ display: 'flex', flexDirection: 'column' }} disableGutters={true}>
                {/* <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        bgcolor: "#F2F2F2",
                        px: '8%',
                        py: 0.5
                    }}
                >
                    <Box component="span" mt={1}>
                        <Typography display='inline-block' variant='body1' fontSize={14}>{`${t("Zone")}: `}</Typography>
                        <Typography sx={{ marginInlineStart: 5 }} display='inline-block' variant='h4' fontSize={16}>{zone}</Typography>
                    </Box>
                </Box> */}
                <Box p={2} flex={1} pb={6}>
                    {
                        map(
                            orders,
                            order => <ShipmentCard key={order._id} order={order} handleDetailsClick={handleOrderDetailsClick} />
                        )
                    }
                </Box>
                {
                    !loading && isEmpty(orders) &&
                    <Typography sx={{ alignSelf: 'center' }} variant="h1">{t("No Orders")}</Typography>
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
            </Container>
        </>
    );
};

export default ZoneShipments;
