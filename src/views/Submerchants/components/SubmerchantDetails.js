import React, { useEffect, useState } from 'react';
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
import { isEmpty, pick, set, get, cloneDeep, unset, includes } from 'lodash';
import parsePhoneNumber from 'libphonenumber-js';
import schema from './ValidationSchemas';
import runJoiValidate from "src/__utils__/runJoiValidate";

const SubmerchantDetails = ({
  type,
  submerchantDetails,
  handleSubmit,
  pendingSubmit,
  handleDelete,
  pendingDelete,
  error,
  success,
  ...props
}) => {

  const { t } = useTranslation();
  const [state, setState] = useState({ submerchantDetails: {} });

  useEffect(() => {
    let submerchant = pick(
      cloneDeep(submerchantDetails),
      [
        'name',
        'price',
        'extraPiecePrice'
      ]
    );
    if (type === "add") {
      submerchant = { ...state.submerchantDetails };
    }
    setState({
      ...state,
      submitDisabled: isEmpty(submerchantDetails),
      submerchantDetails: submerchant
    })
  }, [submerchantDetails])

  const getPhoneNumber = (phoneCode, phone) => {
    const phoneNumber = parsePhoneNumber(`${phoneCode}${phone}`, { extract: true })
    if (phoneNumber) return phoneNumber.format('E.164')
  }

  const handleChange = (event) => {
    const details = { ...state.submerchantDetails };
    if (includes(['price', 'extraPiecePrice'], event.target.name) && isNaN(event.target.value)) return
    if (includes(['price', 'extraPiecePrice'], event.target.name) && event.target.value == "0") {
      unset(details, event.target.name)
    } else {
      set(details, event.target.name, event.target.value)
    }
    setState({
      ...state,
      submerchantDetails: {
        ...state.submerchantDetails,
        ...details
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Pick Params
    let paramsToPick = ["name", "price", "extraPiecePrice"]
    let submerchant = pick(
      cloneDeep(state.submerchantDetails),
      paramsToPick
    );
    // Validate
    const validationErrors = runJoiValidate(schema, submerchant);
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    // Process
    const priceAsNumber = Number(submerchant.price);
    submerchant.price = priceAsNumber ? priceAsNumber : 0;
    const extraPiecePriceAsNumber = Number(submerchant.extraPiecePrice);
    submerchant.extraPiecePrice = extraPiecePriceAsNumber ? extraPiecePriceAsNumber : 0;
    handleSubmit(submerchant);
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={t("Profile")} />
            <Divider />
            <CardContent>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Name")}
                    name="name"
                    value={get(state, "submerchantDetails.name") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.name")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Price")}
                    name="price"
                    value={get(state, "submerchantDetails.price") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.price")}
                    type='number'
                    sx={{
                      'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                        'WebkitAppearance': 'none',
                        margin: 0,
                      },
                      'input[type=number]': {
                        'MozAppearance': 'textfield',
                      }
                    }}
                    inputProps={{
                      min: 0,
                      onKeyDown: (evt) => includes(['e', '+', '-', '.'], evt.key) && evt.preventDefault()
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MapItTextField
                    label={t("Extra piece price")}
                    name="extraPiecePrice"
                    value={get(state, "submerchantDetails.extraPiecePrice") || ""}
                    required={true}
                    handleChange={handleChange}
                    error={get(state, "validationErrors.extraPiecePrice")}
                    type='number'
                    sx={{
                      'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                        'WebkitAppearance': 'none',
                        margin: 0,
                      },
                      'input[type=number]': {
                        'MozAppearance': 'textfield',
                      }
                    }}
                    inputProps={{
                      min: 0,
                      onKeyDown: (evt) => includes(['e', '+', '-', '.'], evt.key) && evt.preventDefault()
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
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
                  onClick={handleDelete}
                  loading={pendingDelete}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    marginInlineEnd: '12px'
                  }}
                >
                  {t("Delete Merchant")}
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

export default SubmerchantDetails;
