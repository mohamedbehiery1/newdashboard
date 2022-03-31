import React, { useEffect, useState } from 'react';
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
import { LoadingButton } from "@material-ui/lab";
import moment from "moment";
import 'moment/locale/ar';
import { isEmpty } from 'lodash';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

moment.locale(localStorage.getItem("i18nextLng"));

const DriverBalanceDetails = ({
    balanceDetails,
    disclaimer,
    handleSettle,
    pendingSettle,
    handleDownloadBalanceReport,
    pendingDownloadBalanceReport,
    error,
    ...props
}) => {

    const { t } = useTranslation();
    const [details, setDetails] = useState({});

    useEffect(() => {
        setDetails({ ...balanceDetails })
    }, [balanceDetails])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title={t("Balance Details")} />
                    <Divider />
                    <CardContent>
                        <Grid container justify="center" spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography style={{ color: "#878787" }} variant='body2'>
                                    {t("Order Count")}
                                </Typography>
                                <Typography mt={-0.5} gutterBottom variant='h3'>
                                    {details.orders && details.orders.length || "--"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography style={{ color: "#878787" }} variant='body2'>
                                    {t("Debtor")}
                                </Typography>
                                <Typography mt={-0.5} gutterBottom variant='h3'>
                                    {details.debtor || "--"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography style={{ color: "#878787" }} variant='body2'>
                                    {t("Balance settlement date")}
                                </Typography>
                                <Typography mt={-0.5} gutterBottom variant='h3'>
                                    {
                                        details.settleBalanceDate
                                            ? moment(details.settleBalanceDate).format("DD/MM/YYYY - hh:mm a")
                                            : "--"
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            {
                disclaimer &&
                <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: 'center' }}>
                        <ErrorOutlineIcon sx={{ marginInlineEnd: 4, fontSize: 28 }} />
                        <Typography>{disclaimer}</Typography>
                    </Box>
                </Grid>
            }
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
                            color="main"
                            variant="contained"
                            disableElevation
                            onClick={handleDownloadBalanceReport}
                            loading={pendingDownloadBalanceReport}
                            disabled={isEmpty(details)}
                            sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                mx: 2
                            }}
                        >
                            {t("Download Balance Report")}
                        </LoadingButton>
                        <LoadingButton
                            color="main"
                            variant="contained"
                            disableElevation
                            onClick={handleSettle}
                            loading={pendingSettle}
                            disabled={isEmpty(details)}
                            sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                            }}
                        >
                            {t("Settle Balance")}
                        </LoadingButton>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default DriverBalanceDetails;
