import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import SettingsPassword from "src/components/settings/SettingsPassword";
import AdminProfileDetails from 'src/components/admin-account/AdminProfileDetails';

import { useState } from 'react';
import { useEffect } from 'react';
import { loadAdminDetails } from "src/store/admins";
import { useSelector, useDispatch } from 'react-redux';
import http from 'src/__services__/httpService';
import AuthService from "src/__services__/AuthService";
import HttpService from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const AdminAccount = () => {

  const { id } = AuthService.getCurrentUser()
  const dispatch = useDispatch();
  const Authorization = "Bearer " + AuthService.getJwt();
  const admin = useSelector(state => state.entities.admins.adminDetails);

  // Profile Details
  const [pendingEditSubmit, setPendingEditSubmit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState();

  const editAdmin = async ({ name, email }) => {
    setPendingEditSubmit(true)
    setEditError("")
    setEditSuccess(null);
    try {
      await http.put(`${apiUrl}/v1/admin-panel/admin/${admin.id}`, { name, email })
      setEditSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setEditError(e.response.data.message)
      }
    } finally {
      setPendingEditSubmit(false)
    }
  }

  // Password
  const [pendingPasswordSubmit, setPendingPasswordSubmit] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState();

  const updatePassword = async (formData) => {
    setPendingPasswordSubmit(true);
    setPasswordError("");
    setPasswordSuccess(null);
    try {
      await HttpService.put(
        `${apiUrl}/v1/admin-panel/update-password`,
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

  useEffect(() => {
    dispatch(loadAdminDetails(id));
  }, [])

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
              <AdminProfileDetails
                type="profile"
                profileDetails={admin}
                handleSubmit={editAdmin}
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
          </Grid>
        </Container>
      </Box>
    </>
  )
};

export default AdminAccount;
