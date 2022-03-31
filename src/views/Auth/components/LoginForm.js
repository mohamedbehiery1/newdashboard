import React from "react";
import { Grid, Link, Box, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@material-ui/lab";
import { useNavigate } from 'react-router-dom';
import { MapItTextField } from "src/components/common";
import MapitPhoneInput from "src/components/common/MapitPhoneInput";

const useStyles = makeStyles((theme) => ({
    form: {
        width: "80%", // Fix IE 11 issue.
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    button: {
        '&:hover': {
            backgroundColor: '#00588C',
        },
    }
}));

const LoginForm = ({ role, credentials, validationErrors, onChange, onSubmit, pending, ...props }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getDisclaimer = role => {
        switch (role) {
            case 'admin': return 'Admin Login';
            case 'merchant': return 'Sign in to manage your orders';
            case 'driver': return 'Sign in to view your deliveries';
            default: return '';
        }
    }

    const getSubDisclaimer = role => {
        switch (role) {
            case 'driver': return 'This section is for delivery agents';
            default: return '';
        }
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 2 }}>
                <Typography variant="h4" sx={{ color: "#767676", textAlign: "center" }}>
                    {t(getDisclaimer(role))}
                </Typography>
                <Typography mt={-0.7} variant="subtitle1" sx={{ color: "#C7C7C7", textAlign: "center" }}>
                    {t(getSubDisclaimer(role))}
                </Typography>
            </Box>
            <form onSubmit={onSubmit} className={classes.form} noValidate>
                <Grid container justify="center" spacing={1} mb={0}>
                    {
                        role !== 'driver' &&
                        <Grid item xs={12}>
                            <MapItTextField
                                label={t("Email Address")}
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={credentials.email || ""}
                                required={true}
                                handleChange={onChange}
                                error={validationErrors && validationErrors.email}
                                autoFocus
                                size="small"
                                margin="dense"
                                required
                            />
                        </Grid>
                    }
                    {
                        role === 'driver' &&
                        <Grid item xs={12}>
                            {/* <MapItTextField
                                label={t("Phone Number")}
                                name="phone"
                                type="phone"
                                autoComplete="phone"
                                value={credentials.phone || ""}
                                required={true}
                                handleChange={onChange}
                                error={validationErrors && validationErrors.phone}
                                autoFocus
                                size="small"
                                margin="dense"
                                required
                            /> */}
                            <MapitPhoneInput
                                name="phone"
                                value={credentials.phone}
                                handleChange={onChange}
                                error={validationErrors && validationErrors.phone}
                            />
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <MapItTextField
                            label={t("Password")}
                            name="password"
                            type="password"
                            autoComplete="password"
                            value={credentials.password || ""}
                            required={true}
                            handleChange={onChange}
                            error={validationErrors && validationErrors.password}
                            size="small"
                            margin="dense"
                            required
                        />
                    </Grid>
                </Grid>
                <LoadingButton
                    // component={RouterLink}
                    // to=""
                    type="submit"
                    display="block"
                    // fullWidth
                    disableElevation
                    variant="contained"
                    color="yellow"
                    className={classes.button}
                    sx={{
                        mt: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: 22,
                        px: 4,
                        py: 0.2,
                        marginInline: 'auto'
                    }}
                    loading={pending}
                >
                    {t("Log In")}
                </LoadingButton>
            </form>
            {
                role === 'merchant' &&
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} mt={1.5}>
                    <Link onClick={_ => navigate('/auth/merchant/forgot-password')} variant="body1" sx={{ color: "text.placeholder", cursor: 'pointer' }}>
                        {t("Forgot password?")}
                    </Link>
                    <Link onClick={_ => navigate('/auth/merchant/register')} variant="body1" sx={{ color: "text.placeholder", cursor: 'pointer' }}>
                        {t("Don't have an account? Sign Up")}
                    </Link>
                </Box>
            }
        </Box >
    );
};

export default LoginForm;
