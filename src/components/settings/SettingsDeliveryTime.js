import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Grid,
    MenuItem,
    Select,
} from "@material-ui/core";
import { LoadingButton } from '@material-ui/lab';
import moment from "moment";
import 'moment/locale/ar';
moment.locale(localStorage.getItem("i18nextLng"));

const SettingsDeliveryTime = ({ lastOrderTime, handleSubmit, pendingSubmit, error, success, ...rest }) => {

    const hours = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
    ]

    const { t } = useTranslation();

    const [state, setState] = useState("");

    useEffect(_ => {
        setState(lastOrderTime)
    }, [lastOrderTime]);

    const handleChange = (event) => {
        setState(event.target.value)
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(state);
    };

    return (
        <form onSubmit={onSubmit} autoComplete="off" noValidate {...rest}>
            <Card>
                <CardHeader title={t("Last Order Time")} />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Select
                                onChange={handleChange}
                                autoWidth
                                value={state}
                                color="main"
                                size="small"
                                MenuProps={{ sx: { maxHeight: '315px' } }}
                            >
                                {hours.map((hour) => (
                                    <MenuItem key={hour} value={hour}>
                                        {moment().set({ h: hour.slice(0, 2), m: 0, s: 0 }).format("h:mm A")}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: error || success ? "space-between" : "flex-end",
                        alignItems: 'center',
                        p: 2,
                    }}
                >
                    {error && <Typography color='text.danger'>{t(error)}</Typography>}
                    {success && <Typography color='success.main'>{t(success)}</Typography>}
                    <LoadingButton
                        color="main"
                        variant="contained"
                        disableElevation
                        type="submit"
                        loading={pendingSubmit}
                        sx={{
                            mt: 1,
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                        disabled={state === lastOrderTime}
                    >
                        {t("Update")}
                    </LoadingButton>
                </Box>
            </Card>
        </form>
    );
};

export default SettingsDeliveryTime;
