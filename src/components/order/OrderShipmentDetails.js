import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography,
    Box
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { map, isEmpty } from 'lodash';
import generateCloudinaryLink from 'src/__utils__/generateCloudinaryLink';
import { generatePDF } from 'src/__utils__/pdfUtils';
import AWB from "src/views/AWB";
import moment from "moment";
import 'moment/locale/ar';

moment.locale(localStorage.getItem("i18nextLng"));

const OrderShipmentDetails = ({ details, ...props }) => {

    const { t } = useTranslation();

    const { orderNumber, createdAt, updatedAt, barCode, statusTrack, zone, failReason, notes, completedOrderImage } = details;

    const [loadingAWB, setLoadingAWB] = useState(false);
    const handleAWBClick = _ => {
        setLoadingAWB(true);
        generatePDF(
            details.barCode,
            "awb",
            "display",
            `AWB_Order#${orderNumber}`,
            _ => setLoadingAWB(false)
        );
    }

    return (
        <Card>
            <CardHeader
                title={t("Shipment Info")}
                action={
                    <LoadingButton
                        onClick={handleAWBClick}
                        color="main"
                        variant="contained"
                        disableElevation
                        loading={loadingAWB}
                        disabled={isEmpty(details)}
                        sx={{
                            mt: 1,
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        {t("Print AWB")}
                    </LoadingButton>
                }
            >
            </CardHeader>
            <Divider />
            <CardContent>
                <Grid container spacing={3} padding={3}>
                    <Grid container item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} >
                        <Box>
                            <Typography variant='body2'>
                                {`${t("Order Number")} `}
                            </Typography>
                            <Typography variant='h3'>
                                {orderNumber}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='body2'>
                                {`${t("Zone")} `}
                            </Typography>
                            <Typography variant='h3'>
                                {zone && zone.name}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='body2'>
                                {`${t("Created At")} `}
                            </Typography>
                            <Typography variant='h3'>
                                {createdAt && moment(createdAt).format("DD/MM/YYYY - hh:mm a")}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='body2'>
                                {`${t("Updated At")} `}
                            </Typography>
                            <Typography variant='h3'>
                                {updatedAt && moment(updatedAt).format("DD/MM/YYYY - hh:mm a")}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} >
                        <Typography variant='body2'>
                            {`${t("Status Track")} `}
                        </Typography>
                        {
                            map(
                                statusTrack,
                                statusTrack => (
                                    <Box sx={{ mb: 0.4 }} key={statusTrack._id}>
                                        <Typography sx={{ mb: -0.6 }} variant="h5">{t(statusTrack.status)}</Typography>
                                        <Typography display='inline-block' variant="h6">{moment(statusTrack.dateTime).format("DD/MM/YYYY - hh:mm a")}</Typography>
                                    </Box>
                                )
                            )
                        }
                        {
                            failReason &&
                            <Fragment>
                                <Typography sx={{ marginInlineEnd: 15 }} display='inline-block' variant="h5">{t("Fail Reason")}</Typography>
                                <Typography display='inline-block' variant="h5">{failReason}</Typography>
                            </Fragment>
                        }
                        {
                            notes &&
                            <Fragment>
                                <Typography sx={{ marginInlineEnd: 15 }} display='inline-block' variant="h5">{t("Notes")}</Typography>
                                <Typography display='inline-block' variant="h5">{notes}</Typography>
                            </Fragment>
                        }
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='body2' mb={1}>
                            {`${t("Barcode")}`}
                        </Typography>
                        {
                            map(
                                barCode,
                                barCode => (
                                    <Box
                                        component="img"
                                        sx={{
                                            maxHeight: { xs: 233, md: 167 },
                                            maxWidth: { xs: 350, md: 250 },
                                            aspectRatio: 897 / 86,
                                            mb: 2
                                        }}
                                        alt={t("Barcode")}
                                        src={generateCloudinaryLink(barCode.image)}
                                    />
                                )
                            )
                        }

                    </Grid>
                    {
                        completedOrderImage &&
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant='body2' mb={1}>
                                {`${t("Attachment")}`}
                            </Typography>
                            <Box
                                component="img"
                                sx={{
                                    maxHeight: 500,
                                    // maxWidth: { xs: 350, md: 250 },
                                    aspectRatio: 1
                                }}
                                alt={t("Attachment")}
                                src={generateCloudinaryLink(completedOrderImage)}
                            />
                        </Grid>
                    }
                </Grid>
            </CardContent>
            {
                !isEmpty(details) &&
                <Box>
                    {
                        map(
                            details.barCode,
                            barCode => (<AWB style={{ display: "none" }} id={`awb${barCode.text}`} order={{ ...details, barCode }} />)
                        )
                    }
                </Box>
            }
        </Card>
    )
};

export default OrderShipmentDetails;