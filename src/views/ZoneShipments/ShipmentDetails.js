import React from "react";
import {
    Box,
    Typography,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

const ShipmentDetails = ({ orderNumber, user }) => {
    const { t } = useTranslation();
    return (
        <Box pb={0}>
            <Box component="div">
                <Typography color='#C7C7C7' display='inline-block' variant='subtitle1'>{`${t("Order Number")} `}</Typography>
                <Typography color='#767676' sx={{ marginInlineStart: 5 }} display='inline-block' variant='h6'>{orderNumber}</Typography>
            </Box>
            <Box component="div" mt={-1.5}>
                <Typography color='#767676' display='inline-block' variant='h6'>{user.name}</Typography>
            </Box>
            {
                user.address.street && user.address.area &&
                <Box component="div" mt={-1.5}>
                    <Typography color='#767676' display='inline-block' variant='h6'>{user.address.street + t(", ") + user.address.area}</Typography>
                </Box>
            }
        </Box>
    )
}

export default ShipmentDetails;