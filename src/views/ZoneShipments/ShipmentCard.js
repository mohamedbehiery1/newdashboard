import React from "react";
import {
    IconButton,
    Card,
    CardHeader,
} from "@material-ui/core";
import 'moment/locale/ar';
import CustomIcon from "src/components/CustomIcon";
import ShipmentDetails from "./ShipmentDetails";
import { useTranslation } from 'react-i18next';

const ShipmentCard = ({ order, handleDetailsClick }) => {
    const { i18n } = useTranslation();

    return (
        <Card key={order._id} sx={{
            borderWidth: 0.1,
            borderStyle: "solid",
            borderColor: "#C7C7C7",
            borderRadius: 1,
            mb: 1
        }}>
            <CardHeader
                sx={{ py: 1.2 }}
                action={
                    <IconButton onClick={_ => handleDetailsClick(order._id)} aria-label="navigation">
                        <CustomIcon style={{ transform: i18n.dir() === 'rtl' ? '' : 'scale(-1, 1)' }} type='order_details' />
                    </IconButton>
                }
                title={<ShipmentDetails orderNumber={order.orderNumber} user={order.user} />}
            >
            </CardHeader>
        </Card>
    )
}

export default ShipmentCard;