import { useState, useEffect, Fragment } from "react";
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
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from "@material-ui/lab";
import { MapItTextField } from "src/components/common";
import { isEmpty, pick, split, last, omit, startsWith, get } from 'lodash';
import parsePhoneNumber from 'libphonenumber-js';
import { MerchantLogo } from "src/components/merchant";
import { editValidationSchema, addValidationSchema } from './ValidationSchemas';
import AuthService from "src/__services__/AuthService";
import MapitPhoneInput from "src/components/common/MapitPhoneInput";

const MerchantProfileDetails = ({
  type,
  profileDetails,
  handleSubmit,
  pendingSubmit,
  handleDelete,
  pendingDelete,
  error,
  success,
  ...props
}) => {

  const { t } = useTranslation();
  const { role } = AuthService.getCurrentUser();

  const [state, setState] = useState({ profileDetails: {} });

  useEffect(() => {
    console.log(profileDetails);
    const profile = pick(
      profileDetails,
      [
        'companyName',
        'logo',
        'email',
        'managerName',
        'password',
        'confirm'
      ]
    );
    if (type === "edit")
      profile.phone = getPhoneNumber(profileDetails.phoneCode, profileDetails.phone);
    setState({
      ...state,
      submitDisabled: isEmpty(profileDetails),
      profileDetails: profile
    })
  }, [profileDetails])

  const getPhoneNumber = (phoneCode, phone) => {
    const phoneNumber = parsePhoneNumber(`${phoneCode}${phone}`, { extract: true })
    if (phoneNumber) return phoneNumber.format('E.164')
  }

  const handleChange = (event) => {
    // File Chosen
    if (event.target.name === "file") {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.addEventListener("load", function () {
        const base64String = reader.result
        handleChange({
          target: {
            name: "logo",
            value: base64String
          }
        })
      }, false);
      return reader.readAsDataURL(file);
    }
    // Event
    setState({
      ...state,
      profileDetails: {
        ...state.profileDetails,
        [event.target.name]: event.target.value,
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Pick Params
    let profile = pick(
      state.profileDetails,
      [
        'companyName',
        'logo',
        'email',
        'managerName',
        'password',
        'confirm',
        'phone'
      ]
    );
    // Define Schema
    const schema = type === "edit" ? editValidationSchema : addValidationSchema;
    // Validate
    const validationErrors = runJoiValidate(schema, profile);
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    // Process
    const parsedPhone = parsePhoneNumber(state.profileDetails.phone, { extract: true })
    profile.phoneCode = `+${parsedPhone.countryCallingCode}`;
    profile.phone = parsedPhone.nationalNumber;
    if (startsWith(profile.logo, "data")) {
      profile.logo = last(split(profile.logo, ","))
    } else {
      profile = omit(profile, ["logo"])
    }
    handleSubmit(profile);
  };

  const onDelete = _ => {
    handleDelete(profileDetails.id)
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader
          title={t(role === "admin" ? "Basic Details" : "Profile")}
          action={role === 'admin' && type === "edit" &&
            <LoadingButton
              color="danger"
              variant="contained"
              disableElevation
              onClick={onDelete}
              loading={pendingDelete}
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {t("Delete Account")}
            </LoadingButton>
          }
        >
        </CardHeader>
        <Divider />
        <CardContent>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} sm={4} md={3}>
              <MerchantLogo
                logo={state.profileDetails.logo}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.logo}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={9} container spacing={3} alignContent="center">
              <Grid item xs={12} md={6}>
                <MapItTextField
                  label={t("Merchant Name")}
                  size="small"
                  name="companyName"
                  value={state.profileDetails.companyName || ""}
                  required={true}
                  handleChange={handleChange}
                  error={state.validationErrors && state.validationErrors.companyName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MapItTextField
                  label={t("Manager Name")}
                  size="small"
                  name="managerName"
                  value={state.profileDetails.managerName || ""}
                  required={true}
                  handleChange={handleChange}
                  error={state.validationErrors && state.validationErrors.managerName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MapItTextField
                  label={t("Email Address")}
                  size="small"
                  name="email"
                  value={state.profileDetails.email || ""}
                  required={true}
                  handleChange={handleChange}
                  error={state.validationErrors && state.validationErrors.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MapitPhoneInput
                  label={t("Phone")}
                  size="small"
                  name="phone"
                  value={get(state, "profileDetails.phone")}
                  handleChange={handleChange}
                  error={get(state, "validationErrors.phone")}
                />
              </Grid>
              {
                type === 'add' &&
                <Fragment>
                  <Grid item xs={12} md={6}>
                    <MapItTextField
                      label={t("Password")}
                      size="small"
                      name="password"
                      type="password"
                      value={state.profileDetails.password || ""}
                      required={true}
                      handleChange={handleChange}
                      error={state.validationErrors && state.validationErrors.password}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MapItTextField
                      label={t("Confirm password")}
                      size="small"
                      name="confirm"
                      type="password"
                      value={state.profileDetails.confirm || ""}
                      required={true}
                      handleChange={handleChange}
                      error={state.validationErrors && state.validationErrors.confirm}
                    />
                  </Grid>
                </Fragment>
              }
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
            disabled={type === "edit" && state.submitDisabled}
            sx={{
              mt: 1,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {type === "edit" && t("Save")}
            {type === "add" && t("Add")}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
};

export default MerchantProfileDetails;
