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
} from "@material-ui/core";
import * as Joi from "joi";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from "@material-ui/lab";
import { MapItTextField } from "src/components/common";
import parsePhoneNumber from 'libphonenumber-js';
import MapitPhoneInput from "src/components/common/MapitPhoneInput";
import { get } from "lodash";

const ContactForm = ({
  handleSubmit,
  pendingSubmit,
  error,
  success,
  state: navigationState,
  ...props
}) => {

  const { t } = useTranslation();

  const [state, setState] = useState({});

  useEffect(_ => {
    if (navigationState) setState(navigationState)
  }, [])

  const validationSchema = Joi.object({
    name: Joi.string()
      .min(3)
      .required("required")
      .label("Name"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required("required")
      .label("Email"),
    phone: Joi.string()
      .required("required")
      .label("Phone")
      .custom((value, helper) => {
        const parsedPhone = parsePhoneNumber(value, { extract: true });
        if (!parsedPhone || !parsedPhone.isValid())
          return helper.message("Invalid Phone Number");
        return true
      }),
    subject: Joi.string()
      .min(3)
      .required()
      .label("Subject"),
    message: Joi.string()
      .min(10)
      .required()
      .label("Message"),
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Validate
    const { ...message } = state;
    const validationErrors = runJoiValidate(validationSchema, message);
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    handleSubmit(message);
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader title={t("Contact Us")} />
        <Divider />
        <CardContent>
          <Grid container spacing={3} >
            <Grid item xs={12}>
              <MapItTextField
                label={t("Name")}
                size="small"
                name="name"
                value={state.name || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <MapItTextField
                label={t("Email Address")}
                size="small"
                name="email"
                value={state.email || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <MapitPhoneInput
                label={t("Phone")}
                size="small"
                name="phone"
                value={get(state, "phone")}
                handleChange={handleChange}
                error={get(state, "validationErrors.phone")}
              />
            </Grid>
            <Grid item xs={12}>
              <MapItTextField
                label={t("Subject")}
                size="small"
                name="subject"
                value={state.subject || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.subject}
              />
            </Grid>
            <Grid item xs={12}>
              <MapItTextField
                label={t("Message")}
                size="small"
                name="message"
                value={state.message || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.message}
                multiline
                minRows={5}
              />
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
          >
            {t("Submit")}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
};

export default ContactForm;
