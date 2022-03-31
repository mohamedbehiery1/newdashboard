import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography,
    Avatar
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { LoadingButton } from "@material-ui/lab";
import { map } from 'lodash';
import moment from "moment";
import 'moment/locale/ar';
import AuthService from "src/__services__/AuthService";
import generateCloudinaryLink from '../../__utils__/generateCloudinaryLink';
moment.locale(localStorage.getItem("i18nextLng"));

const OrderShipmentDetails = ({ details, ...props }) => {

    const { t } = useTranslation();
    const { role } = AuthService.getCurrentUser();
    const { id, orderNumber, createdAt, updatedAt, qr, statusTrack, zone } = details;

    return (
        <Card>
            <CardHeader
                title={t("Shipment Info")}
                action={
                    <LoadingButton
                        component={RouterLink}
                        to={{
                            pathname: `/${role}/orders/awb/${id}`,
                            state: { source: 'details' }
                        }}
                        color="main"
                        variant="contained"
                        disableElevation
                        // onClick={onDelete}
                        // pending={pendingDelete}
                        sx={{
                            mt: 1,
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        {t("View AWB")}
                    </LoadingButton>
                }
            >
            </CardHeader>
            <Divider />
            <CardContent>
                <Grid container spacing={3} padding={3}>
                    <Grid container item xs={12} sm={4}>
                        <Grid item xs={12}>
                            <Typography variant='body2'>
                                {`${t("Order Number")} `}
                            </Typography>
                            <Typography variant='h3'>
                                {orderNumber}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body2'>
                                {`${t("Zone")} `}
                            </Typography>
                            <Typography variant='h3'>
                                {zone && zone.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body2'>
                                {`${t("Created At")} `}
                            </Typography>
                            <Typography variant='h3'>
                                {createdAt && moment(createdAt).format("DD/MM/YYYY - hh:mm a")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body2'>
                                {`${t("Updated At")} `}
                            </Typography>
                            <Typography variant='h3'>
                                {updatedAt && moment(updatedAt).format("DD/MM/YYYY - hh:mm a")}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4} >
                        <Typography variant='body2'>
                            {`${t("Status Track")} `}
                        </Typography>
                        {
                            map(
                                statusTrack,
                                statusTrack => (
                                    <Fragment key={statusTrack._id}>
                                        <Typography sx={{ marginInlineEnd: 15 }} display='inline-block' variant="h5">{t(statusTrack.status)}</Typography>
                                        <Typography display='inline-block' variant="h5">{moment(statusTrack.dateTime).format("DD/MM/YYYY - hh:mm a")}</Typography>
                                    </Fragment>
                                )
                            )
                        }
                    </Grid>
                    {
                        qr &&
                        <Grid container item xs={12} md={4}>
                            {
                            /*
                            <Typography variant='body2'>
                                {`${t("QR Code")} `}
                            </Typography>
                            */
                            }
                            <Avatar
                                sx={{ width: 200, height: 200 }}
                                variant='square'
                                src={generateCloudinaryLink(qr)}
                                children={<Typography>{t("QR Code")}</Typography>}
                            />
                        </Grid>
                    }
                </Grid>
            </CardContent>
        </Card>
    )
};

export default OrderShipmentDetails;