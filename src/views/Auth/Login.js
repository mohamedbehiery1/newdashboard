import React, { useState } from "react";
import { Box, Typography, Container } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { $APP_NAME } from "src/constants";
import { Helmet } from "react-helmet";
import { Logo, Copyright } from "src/components";
import { useTranslation } from "react-i18next";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { useNavigate } from 'react-router-dom';
import AuthService from "src/__services__/AuthService";
import { AdminMerchantLoginCredendtialsSchema, DriverLoginCredendtialsSchema } from './ValidationSchemas';
import parsePhoneNumber from 'libphonenumber-js';
import { pick } from "lodash";
import { LoginForm, PhoneVerificationForm } from "./components";

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

const Login = ({ role, ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [state, setState] = useState({
    currentStep: "LOGIN",
    pendingLogin: false,
    pendingVerification: false,
  });

  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState();
  const [loginCredentials, setLoginCredentials] = useState({});
  const [merchant, setMerchant] = useState(); //id, phone


  const getFormattedDriverCredentials = credentials => {
    const { phone: phoneNumber, password } = credentials
    const parsedPhone = parsePhoneNumber(phoneNumber, { extract: true })
    const phoneCode = `+${parsedPhone.countryCallingCode}`;
    const phone = parsedPhone.nationalNumber;
    return { phoneCode, phone, password };
  }

  const handleLoginChange = e => setLoginCredentials({ ...loginCredentials, [e.target.name]: e.target.value })

  const handleLoginSubmit = e => {
    e.preventDefault();
    setValidationErrors(null);

    const credentialsToPick = role === 'driver' ? ['phone', 'password'] : ['email', 'password']
    let credentials = pick(loginCredentials, credentialsToPick);

    const schema = role === 'driver' ? DriverLoginCredendtialsSchema : AdminMerchantLoginCredendtialsSchema;
    const validationErrors = runJoiValidate(schema, credentials);

    if (validationErrors) {
      setValidationErrors(validationErrors);
      return
    } else {
      if (role === 'driver') {
        credentials = getFormattedDriverCredentials(credentials)
      }
      setError("")
      setState({ ...state, pendingLogin: true });
      login(role, credentials);
    }
  };

  const login = async (role, credentials) => {
    try {
      const { token, ...restOfResponse } = await AuthService.login(role, credentials);
      if (role !== 'merchant') {
        navigateToHome(role, token);
      } else {
        const { id, phoneVerified, phone } = restOfResponse;
        if (token && phoneVerified) {
          navigateToHome(role, token);
        } else {
          setMerchant({ id, phone });
          setState({ ...state, pendingLogin: false, currentStep: "PHONE_VERIFICATION" });
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        console.log(e.response)
        setError(e.response.data.message);
      }
      setState({ ...state, pendingLogin: false });
    }
  }

  const navigateToHome = (role, token) => {
    AuthService.loginWithJwt(token);
    setTimeout(_ => navigate(`/${role}`, { replace: true }), 500)
  }

  const handleVerificationSubmit = (otp) => {
    setState({ ...state, pendingVerification: true });
    setError("");
    verifyPhone(otp)
  }

  const handleBackActionFromVerify = _ => {
    setState({ ...state, currentStep: "LOGIN", pendingVerification: false, pendingLogin: false })
    setError("")
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

  // useEffect(() => {
  //   if (AuthService.getCurrentUser())
  //     navigate(`/${role}`, { replace: true });
  // }, []);

  return (
    <>
      <Helmet>
        <title>Login | {$APP_NAME}</title>
      </Helmet>
      <Container sx={{ margin: 'auto' }} maxWidth="xs">
        <Box component="div" py={7} className={classes.paper}>
          <Logo onClick={_ => navigate('/', { replace: true })} style={{ margin: '0px 0px 16px 0px', cursor: 'pointer' }} height={60} />
          {
            state.currentStep === "LOGIN" &&
            <LoginForm
              role={role}
              credentials={{ ...loginCredentials }}
              validationErrors={{ ...validationErrors }}
              onChange={handleLoginChange}
              onSubmit={handleLoginSubmit}
              pending={state.pendingLogin}
            />
          }
          {
            state.currentStep === "PHONE_VERIFICATION" &&
            <PhoneVerificationForm
              phone={merchant.phone}
              onSubmit={handleVerificationSubmit}
              pending={state.pendingVerification}
              onBack={handleBackActionFromVerify}
            />
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

export default Login;
