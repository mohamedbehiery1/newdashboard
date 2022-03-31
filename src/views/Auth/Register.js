import React, { useState, useEffect, useCallback } from "react";
import {
    Typography,
    Box,
    Container,
    Link
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { $APP_NAME } from "src/constants";
import { Helmet } from "react-helmet";
import { Logo, Copyright } from "src/components";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import AuthService from "src/__services__/AuthService";
import parsePhoneNumber from 'libphonenumber-js';
import { RegistrationForm, PhoneVerificationForm, ChangePhoneForm, RegistrationComplete } from "./components";
import { last, split, startsWith, pick, omit, unset, get } from "lodash";
import { useLocation } from 'react-router-dom';
import { MerchantSignupSchema } from './ValidationSchemas';
import runJoiValidate from "src/__utils__/runJoiValidate";

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
    }
}));

// Steps: REGISTRATION, PHONE_VERIFICATION, CHANGE_PHONE

const Register = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState({
        complete: false,
        currentStep: "REGISTRATION",
        pendingRegistration: false,
        pendingVerification: false,
        pendingPhoneChange: false
    });

    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState();
    const [signupCredentials, setSignupCredentials] = useState({ isShippingCompany: false });
    const [merchant, setMerchant] = useState();

    useEffect(_ => {
        if (location.state && location.state.email)
            setSignupCredentials({ ...signupCredentials, email: location.state.email })
    }, [])

    const handleRegistrationChange = (event) => {
        // File Chosen
        if (event.target.name === "file") {
            const reader = new FileReader();
            const file = event.target.files[0];
            reader.addEventListener("load", function () {
                const base64String = reader.result
                handleRegistrationChange({
                    target: {
                        name: "logo",
                        value: base64String
                    }
                })
            }, false);
            return reader.readAsDataURL(file);
        }
        if (event.target.name === "isShippingCompany") {
            setSignupCredentials({
                ...signupCredentials,
                [event.target.name]: event.target.checked
            });
            return;
        }
        // Event
        setSignupCredentials({
            ...signupCredentials,
            [event.target.name]: event.target.value
        });
    };

    const handleRegistrationSubmit = (e) => {
        e.preventDefault();
        setValidationErrors(null);

        let credentials = pick(
            signupCredentials,
            ['companyName', 'logo', 'email', 'managerName', 'password', 'repeat_password', 'phone', 'isShippingCompany']
        );
        const errors = runJoiValidate(MerchantSignupSchema, credentials);

        if (errors) {
            setValidationErrors(errors);
            return
        } else {
            // phone
            const parsedPhone = parsePhoneNumber(signupCredentials.phone, { extract: true })
            credentials.phoneCode = `+${parsedPhone.countryCallingCode}`;
            credentials.phone = parsedPhone.nationalNumber;
            // type
            credentials.role = credentials.isShippingCompany ? "SHIPPING_COMPANY" : "BASIC";
            unset(credentials, 'isShippingCompany')
            // logo
            if (startsWith(credentials.logo, "data")) {
                credentials.logo = last(split(credentials.logo, ","))
            } else {
                credentials = omit(credentials, ["logo"])
            }
            setState({ ...state, pendingRegistration: true });
            setValidationErrors(null);
            setError("");
            register(credentials);
        }
    };

    const register = async (credentials) => {
        try {
            const merchantData = await AuthService.registerAsMerchant(credentials);
            setMerchant(merchantData);
            if (!merchantData.phoneVerified) {
                setState({ ...state, pendingRegistration: false, currentStep: "PHONE_VERIFICATION" });
            } else {
                // set complete true
            }
        } catch (e) {
            if (e.response && e.response.data) setError(e.response.data.message);
            setState({ ...state, pendingRegistration: false })
        }
    }

    const toggleChangingPhone = useCallback(_ => {
        if (state.currentStep === "PHONE_VERIFICATION" && !state.pendingVerification) {
            setState({ ...state, currentStep: "CHANGE_PHONE" });
        }
        if (state.currentStep === "CHANGE_PHONE" && !state.pendingPhoneChange) {
            setState({ ...state, currentStep: "PHONE_VERIFICATION" });
        }
    }, [state]);

    const handleVerificationSubmit = (otp) => {
        setState({ ...state, pendingVerification: true });
        setError("");
        verifyPhone(otp)
    }

    const verifyPhone = async (otp) => {
        try {
            const response = await AuthService.verifyPhone({ merchant: merchant.id, code: otp });
            // setState({ ...state, pendingVerification: false, complete: true });
            const { token } = response.data.body;
            console.log(token)
            AuthService.loginWithJwt(token);
            setTimeout(_ => {
                navigate("/merchant");
            }, 500)
        } catch (e) {
            console.log(e);
            if (e.response && e.response.data) setError(e.response.data.message);
            setState({ ...state, pendingVerification: false })
        }
    }

    const handlePhoneChangeSubmit = (newPhone) => {
        setState({ ...state, pendingPhoneChange: true });
        setError("");
        const parsedPhone = parsePhoneNumber(newPhone, { extract: true })
        changePhone({
            email: merchant.email,
            phoneCode: `+${parsedPhone.countryCallingCode}`,
            phone: parsedPhone.nationalNumber,
        });
    }

    const changePhone = async (params) => {
        try {
            const response = await AuthService.changeMerchantRegistrationPhone(params);
            const { phoneCode, phone } = response.data.body;
            setSignupCredentials({ ...signupCredentials, phone: phoneCode + phone })
            setState({ ...state, pendingPhoneChange: false, currentStep: "PHONE_VERIFICATION" });
        } catch (e) {
            console.log(e);
            if (e.response && e.response.data) setError(e.response.data.message);
            setState({ ...state, pendingPhoneChange: false })
        }
    }

    return (
        <>
            <Helmet>
                <title>Registration | {$APP_NAME}</title>
            </Helmet>
            <Container sx={{ margin: 'auto' }} maxWidth="md">
                <Box component="div" py={7} className={classes.paper}>
                    <Logo onClick={_ => navigate("/", { replace: true })} style={{ margin: '0px 0px 16px 0px', cursor: 'pointer' }} height={60} />
                    {
                        state.currentStep === "REGISTRATION" &&
                        <RegistrationForm
                            credentials={{ ...signupCredentials }}
                            validationErrors={{ ...validationErrors }}
                            onChange={handleRegistrationChange}
                            onSubmit={handleRegistrationSubmit}
                            pending={state.pendingRegistration}
                        />
                    }
                    {
                        state.currentStep === "PHONE_VERIFICATION" &&
                        <>
                            <PhoneVerificationForm
                                phone={signupCredentials.phone}
                                onSubmit={handleVerificationSubmit}
                                pending={state.pendingVerification}
                            />
                            <Link onClick={toggleChangingPhone} variant="body1" sx={{ color: "text.placeholder", cursor: 'pointer', mt: 1.5 }}>
                                {t("Change Phone")}
                            </Link>
                        </>
                    }
                    {
                        state.currentStep === "CHANGE_PHONE" &&
                        <>
                            <ChangePhoneForm
                                phone={signupCredentials.phone}
                                onSubmit={handlePhoneChangeSubmit}
                                pending={state.pendingPhoneChange}
                            />
                            <Link onClick={toggleChangingPhone} variant="body1" sx={{ color: "text.placeholder", cursor: 'pointer', mt: 1.5 }}>
                                {t("Cancel")}
                            </Link>
                        </>
                    }
                    {
                        error &&
                        <Typography my={1} mx={1} variant="subtitle1" color="text.danger">
                            {t(error)}
                        </Typography>
                    }
                </Box>
                <Box mt={1}>
                    <Copyright title={t("Copyright © ")} />
                </Box>
            </Container>
        </>
    );
};

export default Register;
