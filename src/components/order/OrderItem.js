import React from 'react';
import { useTranslation } from "react-i18next";
import {
    Box,
    Typography,
} from "@material-ui/core";
import { DeleteForeverOutlined } from '@material-ui/icons';

const OrderItem = ({ item, handleRemove, deletable }) => {
    const { t } = useTranslation();
    return !!item ?
        <Box sx={{ display: "flex", width: '100%' }}>
            <Box mx={4} mb={1} sx={{ display: "flex", flexDirection: 'column', flex: 1 }}>
                <Typography sx={{ fontSize: 13, }}>{t("Description") + ":"}</Typography>
                <Typography mt={-0.7} sx={{ fontSize: 16, fontWeight: 'bold' }}>{item.item}</Typography>
            </Box>
            <Box mx={4} mb={1} sx={{ display: "flex", flexDirection: 'column' }}>
                <Typography sx={{ fontSize: 13, }}>{t("Count") + ":"}</Typography>
                <Typography mt={-0.7} sx={{ fontSize: 16, fontWeight: 'bold' }}>{item.amount}</Typography>
            </Box>
            {
                deletable &&
                <Box mx={4} mb={1} sx={{ display: "flex", flexDirection: 'column', justifyContent: "center", cursor: "pointer" }}>
                    <DeleteForeverOutlined onClick={_ => handleRemove(item._id)} />
                </Box>
            }
        </Box>
        :
        <></>
}

export default OrderItem;