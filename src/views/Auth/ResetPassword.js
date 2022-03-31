import React, { useState, useEffect } from "react";
import {
    Link,
    Button,
    Box,
    Typography,
    Container,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { $APP_NAME } from "src/constants";
import { Helmet } from "react-helmet";
import { Logo, Copyright } from "src/components";
import { useTranslation } from "react-i18next";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from "@material-ui/lab";
import { useNavigate } from 'react-router-dom';
import AuthService from "src/__services__/AuthService";
import { MapItTextField } from "src/components/common";
import { ResetPasswordSchema } from './ValidationSchemas';
import { pick } from "lodash";
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "8px",
        borderWidth: "2px",
        borderColor: "#f2f2f2",
        borderStyle: "solid",
    },
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

const ResetPassword = ({ ...props }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation()

    const [token, setToken] = useState();
    const [pending, setPending] = useState(false);
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState("")
    const [validationErrors, setValidationErrors] = useState();
    const [state, setState] = useState({
        password: "",
        repeat_password: ""
    });

    useEffect(_ => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        setToken(token);
    }, [])

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        let credentials = pick(state, ['password', 'repeat_password']);
        const validationErrors = runJoiValidate(ResetPasswordSchema, credentials);
        setValidationErrors(validationErrors)
        if (!validationErrors) {
            if (!token) {
                setError(t("resetPassword.invalidUrlToken"))
                return
            }
            setError("");
            setPending(true);
            resetPassword({ token, ...credentials })
        }
    };

    const resetPassword = async (credentials) => {
        try {
            await AuthService.resetPassword(credentials);
            setComplete(true)
        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data.message)
            }
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <Helmet>
                <title>ResetPassword | {$APP_NAME}</title>
            </Helmet>
            <Container sx={{ margin: 'auto' }} maxWidth="xs">
                <Box component="div" py={7} px={3} className={classes.paper}>
                    <Logo onClick={_ => navigate('/', { replace: true })} style={{ margin: '0px 0px 16px 0px', cursor: 'pointer' }} height={60} />
                    <Typography variant="h4" sx={{ color: "#767676", textAlign: "center", mb: 1 }}>
                        {t("resetPassword.title")}
                    </Typography>
                    {
                        complete
                            ?
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: "#C7C7C7", textAlign: "center" }}>
                                        {t("resetPassword.complete")}
                                    </Typography>
                                </Box>
                                <Button
                                    onClick={_ => navigate('/auth/merchant')}
                                    display="block"
                                    disableElevation
                                    sx={{
                                        mt: 3,
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        px: 4,
                                        py: 0.2,
                                        marginInline: 'auto'
                                    }}
                                >
                                    {t("resetPassword.login")}
                                </Button>
                            </>
                            :
                            <>
                                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                                    <Box sx={{ alignSelf: 'stretch', my: 1 }}>
                                        <MapItTextField
                                            label={t("Password")}
                                            name="password"
                                            type="password"
                                            value={state.password || ""}
                                            required={true}
                                            handleChange={handleChange}
                                            size="small"
                                            error={validationErrors && validationErrors.password}
                                        />
                                    </Box>
                                    <Box sx={{ alignSelf: 'stretch', my: 1 }}>
                                        <MapItTextField
                                            label={t("Confirm password")}
                                            name="repeat_password"
                                            type="password"
                                            value={state.repeat_password || ""}
                                            required={true}
                                            handleChange={handleChange}
                                            size="small"
                                            error={validationErrors && validationErrors.repeat_password}
                                        />
                                    </Box>
                                    <LoadingButton
                                        type="submit"
                                        display="block"
                                        disableElevation
                                        variant="contained"
                                        color="yellow"
                                        className={classes.button}
                                        sx={{
                                            mt: 1,
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            fontSize: 20,
                                            px: 4,
                                            py: 0.2,
                                            marginInline: 'auto'
                                        }}
                                        loading={pending}
                                    >
                                        {t("resetPassword.reset")}
                                    </LoadingButton>
                                </form>
                                {
                                    error &&
                                    <Typography my={1} mx={1} variant="subtitle1" color="text.danger">
                                        {t(error)}
                                    </Typography>
                                }
                            </>
                    }
                </Box>
                <Box mt={1}>
                    <Copyright title={t("Copyright © ")} />
                </Box>
            </Container>
        </>
    );
};

export default ResetPassword;
