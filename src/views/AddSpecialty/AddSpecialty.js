import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import SpecialtyDetails from 'src/components/specialty/SpecialtyDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const AddSpecialty = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");

  const addSpecialty = async (formData) => {
    setPendingSubmit(true)
    setError("")
    try {
      await http.post(`${apiUrl}/lookup/scrap-type`, formData);
      navigate("/admin/specialties", { replace: true })
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
        <title>Add Specialty | {$APP_NAME}</title>
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
              <SubPageHeader title={t("Add Specialty")} actionRoute='/admin/cities' actionTitle={t('Back')} />
            </Grid>
            <Grid item xs={12}>
              <SpecialtyDetails
                type="add"
                handleSubmit={addSpecialty}
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

export default AddSpecialty;
