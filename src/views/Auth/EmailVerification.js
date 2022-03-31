import React, { useEffect, useState } from "react";
import {
    Link,
    Button,
    Box,
    Typography,
    Container,
    CircularProgress,
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

const EmailVerification = ({ role, ...props }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation()

    const [token, setToken] = useState();
    const [pending, setPending] = useState(true);
    const [error, setError] = useState("")

    useEffect(_ => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        setToken(token);
    }, [])

    useEffect(_ => {
        if (token) {
            console.log("token grabbed", token);
            verifyEmail(token);
        }
    }, [token])

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     let { email } = state;
    //     const validationError = runJoiValidate(ForgotPasswordSchema, email);
    //     setValidationError(validationError || "")
    //     if (!validationError) {
    //         sendEmail(email)
    //     }
    // };

    const verifyEmail = async (email) => {
        setError("")
        setPending(true);
        try {
            await AuthService.verifyEmail(token);
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
                <title>Email Verification | {$APP_NAME}</title>
            </Helmet>
            <Container sx={{ margin: 'auto' }} maxWidth="sm">
                <Box component="div" py={7} px={3} className={classes.paper}>
                    <Logo onClick={_ => navigate('/', { replace: true })} style={{ margin: '0px 0px 16px 0px', cursor: 'pointer' }} height={60} />
                    <Typography variant="h4" sx={{ color: "#767676", textAlign: "center", mb: 1 }}>
                        {t("verifyMail.title")}
                    </Typography>
                    {
                        !pending && !error
                            ?
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: "#C7C7C7", textAlign: "center" }}>
                                        {t("verifyMail.complete")}
                                    </Typography>
                                </Box>
                                <Button
                                    onClick={_ => navigate('/auth/merchant')}
                                    display="block"
                                    disableElevation
                                    sx={{
                                        // mt: 3,
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        px: 4,
                                        py: 0.2,
                                        marginInline: 'auto'
                                    }}
                                >
                                    {t("Home")}
                                </Button>
                            </>
                            :
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: "#C7C7C7", textAlign: "center" }}>
                                        {t("verifyMail.message")}
                                    </Typography>
                                </Box>
                                {
                                    pending &&
                                    <CircularProgress
                                    color="main"
                                    />
                                }
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

export default EmailVerification;
