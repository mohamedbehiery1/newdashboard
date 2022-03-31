import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import AdminProfileDetails from 'src/components/admin-account/AdminProfileDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const AddAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");

  const addAdmin = async (formData) => {
    setPendingSubmit(true)
    setError("")
    try {
      await http.post(`${apiUrl}/v1/admin-panel/admin`, formData);
      navigate("/admin/admins", { replace: true })
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
        <title>Add Admin | {$APP_NAME}</title>
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
              <SubPageHeader title={t("Add Admin")} actionRoute='/admin/admins' actionTitle={t('Back')} />
            </Grid>
            <Grid item xs={12}>
              <AdminProfileDetails
                type="add"
                // profileDetails={}
                handleSubmit={addAdmin}
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

export default AddAdmin;
