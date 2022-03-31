import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { useState } from "react";
import { $APP_NAME } from "src/constants";
import { SettingsForm } from "./components";
import HttpService from 'src/__services__/httpService';
import AuthService from "src/__services__/AuthService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const GeneralSettings = () => {

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState();

  const updateSettings = async (formData) => {
    setPendingSubmit(true);
    setError("");
    setSuccess(null);
    const Authorization = "Bearer " + AuthService.getJwt();
    try {
      await HttpService.put(
        `${apiUrl}/v1/admin-panel/setting`,
        formData,
        { headers: { Authorization } }
      )
      setSuccess("Settings updated successfully")

    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>General Settings | {$APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SettingsForm
                handleSubmit={updateSettings}
                pendingSubmit={pendingSubmit}
                error={error}
                success={success}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default GeneralSettings;
