import React, { useState } from "react";
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
import { ForgotPasswordSchema } from './ValidationSchemas';

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

const ForgotPassword = ({ role, ...props }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [state, setState] = useState({
        complete: false,
        pending: false,
        email: "",
    });

    const [error, setError] = useState("")
    const [validationError, setValidationError] = useState("")

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        let { email } = state;
        const validationError = runJoiValidate(ForgotPasswordSchema, email);
        setValidationError(validationError || "")
        if (!validationError) {
            sendEmail(email)
        }
    };

    const sendEmail = async (email) => {
        setError("")
        setState({ ...state, pending: true });
        try {
            await AuthService.sendEmailToResetPassword(email);
            setState({ ...state, complete: true, pending: false });
        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data.message)
            }
            setState({ ...state, pending: false });
        }
    }

    return (
        <>
            <Helmet>
                <title>ForgotPassword | {$APP_NAME}</title>
            </Helmet>
            <Container sx={{ margin: 'auto' }} maxWidth="sm">
                <Box component="div" py={7} px={3} className={classes.paper}>
                    <Logo onClick={_ => navigate('/', { replace: true })} style={{ margin: '0px 0px 16px 0px', cursor: 'pointer' }} height={60} />
                    <Typography variant="h4" sx={{ color: "#767676", textAlign: "center", mb: 1 }}>
                        {t("forgotPassword.title")}
                    </Typography>
                    {
                        state.complete
                            ?
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: "#C7C7C7", textAlign: "center" }}>
                                        {t("forgotPassword.complete")}
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
                                    {t("Back")}
                                </Button>
                            </>
                            :
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: "#C7C7C7", textAlign: "center" }}>
                                        {t("forgotPassword.message")}
                                    </Typography>
                                </Box>
                                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                                    <Box sx={{ alignSelf: 'stretch' }}>
                                        <MapItTextField
                                            label={t("Email Address")}
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={state.email || ""}
                                            required={true}
                                            handleChange={handleChange}
                                            error={validationError}
                                            autoFocus
                                            size="small"
                                            margin="dense"
                                            required
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
                                        loading={state.pending}
                                    >
                                        {t("forgotPassword.sendEmail")}
                                    </LoadingButton>
                                </form>
                                {
                                    error &&
                                    <Typography my={1} mx={1} variant="subtitle1" color="text.danger">
                                        {t(error)}
                                    </Typography>
                                }
                                <Link onClick={_ => navigate('/auth/merchant')} variant="body1" sx={{ color: "text.placeholder", cursor: 'pointer', mt: 1.5 }}>
                                    {t("Have an account? Login")}
                                </Link>
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

export default ForgotPassword;
