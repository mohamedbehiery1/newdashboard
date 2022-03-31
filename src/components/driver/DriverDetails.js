import React, { Fragment, useEffect, useState } from 'react';
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
import { LoadingButton } from "@material-ui/lab";
import { MapItTextField } from "src/components/common";
import { isEmpty, pick, omit, set, get, cloneDeep, concat } from 'lodash';
import parsePhoneNumber from 'libphonenumber-js';
import validationSchemas from './ValidationSchemas';
import runJoiValidate from "src/__utils__/runJoiValidate";
import AuthService from "src/__services__/AuthService";
import { DriverMerchantDetails } from 'src/components/driver';
import MapitPhoneInput from "src/components/common/MapitPhoneInput";

const DriverDetails = ({
  type,
  driverDetails,
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

  const [state, setState] = useState({ driverDetails: {} });

  useEffect(() => {
    let driver = pick(
      cloneDeep(driverDetails),
      [
        'merchant',
        'phone',
        'phoneCode',
        'name',
        'zone'
      ]
    );
    if (type === "edit" && driver) {
      driver.phone = getPhoneNumber(driverDetails.phoneCode, driverDetails.phone);
      driver.zone && (driver.zone = driver.zone.id);
      driver.merchant && (driver.merchant = driver.merchant.id);
    }
    if (type === "add") {
      driver = { ...state.driverDetails };
    }
    driver = omit(driver, ['phoneCode'])
    setState({
      ...state,
      submitDisabled: isEmpty(driverDetails),
      driverDetails: driver
    })
  }, [driverDetails])

  const getPhoneNumber = (phoneCode, phone) => {
    const phoneNumber = parsePhoneNumber(`${phoneCode}${phone}`, { extract: true })
    if (phoneNumber) return phoneNumber.format('E.164')
  }

  const handleChange = (event) => {
    const details = { ...state.driverDetails };
    set(details, event.target.name, event.target.value)
    setState({
      ...state,
      driverDetails: {
        ...state.driverDetails,
        ...details
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Pick Params
    let paramsToPick = ["phone", "name", "zone"]
    if (type === "add") paramsToPick = concat(paramsToPick, ["password", "confirm"]);
    if (role === "admin") paramsToPick.unshift("merchant");
    let driver = pick(
      cloneDeep(state.driverDetails),
      paramsToPick
    );
    // Define Schema
    let schemaPath = type === 'add' ? 'AddValidationSchema' : 'ValidationSchema';
    const schema = validationSchemas[`${role}${schemaPath}`];
    // Validate
    const validationErrors = runJoiValidate(schema, driver);
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    // Process
    const parsedPhone = parsePhoneNumber(driver.phone, { extract: true })
    driver.phoneCode = `+${parsedPhone.countryCallingCode}`;
    driver.phone = parsedPhone.nationalNumber;
    handleSubmit(driver);
  };

  const onDelete = _ => {
    handleDelete(driverDetails.id)
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Grid container spacing={3}>
        {
          role === 'admin' &&
          <Grid item xs={12}>
            <DriverMerchantDetails
              type={type}
              merchant={state.driverDetails.merchant}
              handleChange={handleChange}
              error={state.validationErrors && state.validationErrors.merchant}
            />
          </Grid>
        }
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t("Profile")} />
            <Divider />
            <CardContent>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Name")}
                    size="small"
                    name="name"
                    value={get(state, "driverDetails.name") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.name")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapitPhoneInput
                    label={t("Phone")}
                    name="phone"
                    value={get(state, "driverDetails.phone")}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.phone")}
                  />
                </Grid>
                {
                  type === 'add' &&
                  <Fragment>
                    <Grid item md={6} xs={12}>
                      <MapItTextField
                        label={t("Password")}
                        size="small"
                        name="password"
                        type="password"
                        value={get(state, "driverDetails.password") || ""}
                        required={true}
                        handleChange={handleChange}
                        error={get(state, "validationErrors.password")}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <MapItTextField
                        label={t("Confirm password")}
                        size="small"
                        name="confirm"
                        type="password"
                        value={get(state, "driverDetails.confirm") || ""}
                        required={true}
                        handleChange={handleChange}
                        error={get(state, "validationErrors.confirm")}
                      />
                    </Grid>
                  </Fragment>
                }
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12}>
          <DriverZoneDetails
            zone={state.driverDetails.zone}
            handleChange={handleChange}
            error={state.validationErrors && state.validationErrors.zone}
          />
        </Grid> */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: error || success ? "space-between" : "flex-end",
              alignItems: 'center',
            }}
          >
            {success && <Typography color='success.main'>{t(success)}</Typography>}
            {error && <Typography color='text.danger'>{t(error)}</Typography>}
            <Box>
              {
                type === "edit" &&
                <LoadingButton
                  color="danger"
                  variant="contained"
                  disableElevation
                  onClick={onDelete}
                  loading={pendingDelete}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    marginInlineEnd: '12px'
                  }}
                >
                  {t("Delete Account")}
                </LoadingButton>
              }
              <LoadingButton
                color="main"
                variant="contained"
                disableElevation
                type="submit"
                loading={pendingSubmit}
                disabled={type === "edit" && state.submitDisabled}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {type === "edit" && t("Save")}
                {type === "add" && t("Add")}
              </LoadingButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default DriverDetails;
