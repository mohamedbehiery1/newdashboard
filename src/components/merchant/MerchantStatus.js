import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography,
    Switch
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { isUndefined } from 'lodash';

// "ACTIVE", "WAITING", "BLOCKED"

const MerchantStatus = ({ status, errorStatusChange, pendingStatusChange, handleStatusChange, ...props }) => {

    const { t } = useTranslation();
    const [active, setActive] = useState(false)

    useEffect(() => {
        setActive(status === "ACTIVE")
    }, [status])

    const handleChange = (event) => {
        setActive(event.target.checked)
    };

    const handleClick = _ => {
        let targetStatus = status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
        handleStatusChange(targetStatus)
    };

    return (
        // <form onSubmit={handleSubmit} {...props}>
        <Card>
            <CardHeader title={t("Status")} />
            <Divider />
            <CardContent>
                <Grid component="label" container alignItems="center" spacing={1}>
                    {
                        status === "WAITING"
                            ?
                            <Grid item>
                                <Typography variant="body1">
                                    {t("Waiting for activation")}
                                </Typography>
                            </Grid>
                            :
                            <>
                                <Grid item>
                                    <Typography variant="body2">
                                        {t("BLOCKED")}
                                    </Typography>
                                </Grid>
                                <Grid item >
                                    <Switch
                                        checked={active}
                                        onChange={handleChange}
                                        color="main"
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        {t("ACTIVE")}
                                    </Typography>
                                </Grid>
                            </>
                    }
                </Grid>
            </CardContent>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: errorStatusChange ? "space-between" : "flex-end",
                    alignItems: 'center',
                    p: 2,
                }}
            >
                {errorStatusChange && <Typography color='text.danger'>{t(errorStatusChange)}</Typography>}
                <LoadingButton
                    color="main"
                    variant="contained"
                    disableElevation
                    disabled={isUndefined(status)}
                    type="submit"
                    onClick={handleClick}
                    loading={pendingStatusChange}
                    sx={{
                        mt: 1,
                        textTransform: "none",
                        fontWeight: "bold",
                    }}
                >
                    {status === "WAITING" ? t("Activate") : t("Update")}
                </LoadingButton>
            </Box>
        </Card>
        // </form>
    );
};

export default MerchantStatus;
