import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { DriverDetails } from 'src/components/driver';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from "src/__services__/AuthService";
import driverService from 'src/__services__/driverService';

const AddDriver = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role } = AuthService.getCurrentUser();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");

  const addDriver = async (formData) => {
    setPendingSubmit(true)
    setError("")
    try {
      await driverService.createDriver(role, formData)
      navigate(`/${role}/drivers`, { replace: true })
    } catch (e) {
      console.log(e.response)
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Add Driver | {$APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SubPageHeader title={t("Add Driver")} actionRoute={`/${role}/drivers`} actionTitle={t('Back')} />
            </Grid>
            <Grid item xs={12}>
              <DriverDetails
                type="add"
                driverDetails={{}}
                handleSubmit={addDriver}
                pendingSubmit={pendingSubmit}
                error={error}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default AddDriver;
