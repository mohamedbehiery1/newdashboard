import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import SettingsPassword from "src/components/settings/SettingsPassword";
import { useEffect } from 'react';
import AuthService from "src/__services__/AuthService";
import HttpService from "src/__services__/httpService";
import { useState } from 'react';
import { MerchantLocationPageSettings, MerchantProfileDetails } from "src/components/merchant";
import { MerchantAPIKey } from "src/components/merchant";
import SettingsDeliveryTime from "src/components/settings/SettingsDeliveryTime";
import { pick } from 'lodash';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const MerchantAccount = () => {

  const [profile, setProfile] = useState({});
  const Authorization = "Bearer " + AuthService.getJwt();

  useEffect(_ => {
    console.log(AuthService.getCurrentUser());
  }, [])

  // Profile
  const [pendingEditSubmit, setPendingEditSubmit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState();

  // Password
  const [pendingPasswordSubmit, setPendingPasswordSubmit] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState();

  // LastOrderTime
  const [pendingLastOrderTimeSubmit, setLastOrderTimeSubmit] = useState(false);
  const [lastOrderTimeError, setLastOrderTimeError] = useState("");
  const [lastOrderTimeSuccess, setLastOrderTimeSuccess] = useState();

  // LocationPageSettings
  const [pending, setPending] = useState({ location: false });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});

  const handlePending = (path, value) => setPending({ ...pending, [path]: value });
  const handleError = (path, value) => setError({ ...error, [path]: value });
  const handleSuccess = (path, value) => setSuccess({ ...success, [path]: value });

  const fetchProfile = async _ => {
    try {
      const { data } = await HttpService.get(
        `${apiUrl}/v1/merchant-dashboard/profile`,
        { headers: { Authorization } }
      )
      setProfile(data.body);
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
        setEditError(e.response.data.message)
      }
    }
  }

  const editProfile = async (formData) => {
    setPendingEditSubmit(true)
    setEditError("")
    setEditSuccess(null);
    try {
      const response = await HttpService.put(
        `${apiUrl}/v1/merchant-dashboard/profile`,
        formData,
        { headers: { Authorization } }
      )
      const editedUser = pick(response.data.body, ['companyName', 'email', 'logo']);
      AuthService.setCurrentUser(editedUser);
      // setEditSuccess("Edited successfully");
      setTimeout(_ => window.location.reload(), 200)
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
        setEditError(e.response.data.message)
      }
    } finally {
      setPendingEditSubmit(false)
    }
  }

  const updatePassword = async (formData) => {
    setPendingPasswordSubmit(true);
    setPasswordError("");
    setPasswordSuccess(null);
    try {
      await HttpService.put(
        `${apiUrl}/v1/merchant-dashboard/update-password`,
        formData,
        { headers: { Authorization } }
      )
      setPasswordSuccess("Password changed")
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
        setPasswordError(e.response.data.message)
      }
    } finally {
      setPendingPasswordSubmit(false);
    }
  }

  const updateLastOrderTime = async (time) => {
    setLastOrderTimeSubmit(true);
    setLastOrderTimeError("");
    setLastOrderTimeSuccess(null);
    try {
      await HttpService.put(
        `${apiUrl}/v1/merchant-dashboard/last-order-time`,
        { time },
        { headers: { Authorization } }
      )
      setProfile({
        ...profile,
        lastOrderTime: time
      });
      setLastOrderTimeSuccess("Edited successfully")
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
        setLastOrderTimeError(e.response.data.message)
      }
    } finally {
      setLastOrderTimeSubmit(false);
    }
  }

  const updateLocationPageSettings = async settings => {
    console.log(settings)
    handlePending("location", true);
    handleError("location", null);
    handleSuccess("location", null);
    try {
      const res = await HttpService.put(
        `${apiUrl}/v1/merchant-dashboard/pin-location-page-setting`,
        {
          logo: settings.locationPageLogo,
          color: settings.locationPageColor
        },
        { headers: { Authorization } }
      )
      const updatedSettings = pick(res.data.body, ["locationPageColor", "locationPageLogo"])
      setProfile({
        ...profile,
        ...updatedSettings,
      });
      handleSuccess("location", "Edited successfully")
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
        handleError("location", e.response.data.message)
      }
    } finally {
      handlePending("location", false);
    }
  }

  useEffect(_ => {
    fetchProfile();
  }, []);

  return (
    <>
      <Helmet>
        <title>Account | {$APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MerchantProfileDetails
                type="edit"
                profileDetails={profile}
                handleSubmit={editProfile}
                pendingSubmit={pendingEditSubmit}
                error={editError}
                success={editSuccess}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <SettingsPassword
                handleSubmit={updatePassword}
                pendingSubmit={pendingPasswordSubmit}
                error={passwordError}
                success={passwordSuccess}
              />
            </Grid>
            <Grid item container spacing={3} md={6} xs={12}>
              <Grid item xs={12}>
                <MerchantAPIKey apiKey={profile.apiKey} />
              </Grid>
              {
                Boolean(profile.lastOrderTime) &&
                <Grid item xs={12}>
                  <SettingsDeliveryTime
                    lastOrderTime={profile.lastOrderTime}
                    handleSubmit={updateLastOrderTime}
                    pendingSubmit={pendingLastOrderTimeSubmit}
                    error={lastOrderTimeError}
                    success={lastOrderTimeSuccess}
                  />
                </Grid>
              }
            </Grid>
            <Grid item xs={12} md={6}>
              <MerchantLocationPageSettings
                type="edit"
                settings={pick(profile, ["locationPageColor", "locationPageLogo"])}
                handleSubmit={updateLocationPageSettings}
                pendingSubmit={pending.location}
                error={error.location}
                success={success.location}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
};

export default MerchantAccount;
