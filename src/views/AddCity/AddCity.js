import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import CityDetails from 'src/components/city/CityDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const AddCity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");

  const addCity = async (formData) => {
    setPendingSubmit(true)
    setError("")
    try {
      await http.post(`${apiUrl}/lookup/city`, formData);
      navigate("/admin/cities", { replace: true })
    } catch (e) {
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
        <title>Add City | {$APP_NAME}</title>
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
              <SubPageHeader title={t("Add City")} actionRoute='/admin/cities' actionTitle={t('Back')} />
            </Grid>
            <Grid item xs={12}>
              <CityDetails
                type="add"
                handleSubmit={addCity}
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

export default AddCity;
