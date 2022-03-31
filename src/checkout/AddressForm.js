import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { GpsFixedTwoTone } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import { useState } from 'react';
import HttpService from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

export default function AddressForm({ addressId }) {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false)

  const handlePinLocationClick = async _ => {
    setPending(true);
    try {
      const response = await HttpService.post(
        `${apiUrl}/v1/merchant/location-url`,
        {
          "lang": "ar-SA",
          "callback_url": "https://mapit-frontend-test.herokuapp.com/test" // removed from heroku
        },
        { headers: { Authorization: 'Bearer XRTNRGP-SHK4MZR-GNTR4HX-ZB479H0' } }
      )
      const { body: url } = response.data
      // const newUrl = replace(url, 'https://mapit-frontend-test.herokuapp.com', 'http://localhost:3000')
      // console.log(newUrl);
      window.location.href = url;
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
      }
    } finally {
      setPending(false);
    }
  }

  const requestOrder = async addressId => {
    setPending(true);
    try {
      await HttpService.post(
        `${apiUrl}/v1/merchant/order`,
        {
          addressId: addressId,
          orderItems: ["لابتوب", "كاميرا", "حافظة"],
          user: {
            name: "Mohamed Foda",
            phone: "1006638022",
            phoneCode: "+20"
          }
        },
        { headers: { Authorization: 'Bearer XRTNRGP-SHK4MZR-GNTR4HX-ZB479H0' } }
      )
      navigate('/', { replace: true });
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t("Address")}
      </Typography>
      <Grid container spacing={3}>
        {
          addressId &&
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t("Location pinned successfully")}
            </Typography>
          </Grid>
        }
        {/* <Grid item xs={12}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label={t("Name")}
            fullWidth
            autoComplete="given-name"
            variant="standard"
          />
        </Grid>
         <Grid item xs={12}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label={t("Name")}
            fullWidth
            autoComplete="given-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label={t("Phone")}
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="address2"
            name="City"
            label={t("City")}
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="city"
            name="city"
            label={t("Area")}
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="state"
            name="state"
            label={t("Street")}
            fullWidth
            variant="standard"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label={t("House Number")}
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="country"
            name="country"
            label={t("Floor")}
            fullWidth
            autoComplete="shipping country"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="country"
            name="country"
            label={t("Flat")}
            fullWidth
            autoComplete="shipping country"
            variant="standard"
          />
        </Grid> */}

        <Grid item xs={12} md={6}>
          <LoadingButton
            color="primary"
            variant="contained"
            disableElevation
            onClick={addressId ? _ => requestOrder(addressId) : handlePinLocationClick}
            loading={pending}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              my: 2,
              px: 1.5,
            }}
          >
            {!addressId && <GpsFixedTwoTone sx={{ marginInlineEnd: 8 }} />}
            {t(addressId ? "Place Order" : "Pin Location")}
          </LoadingButton>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
