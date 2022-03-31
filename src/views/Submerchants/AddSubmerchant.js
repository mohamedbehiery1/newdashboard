import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { SubmerchantDetails } from './components';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from "src/__services__/AuthService";
import SubmerchantService from 'src/__services__/SubmerchantService';

const AddSubmerchant = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role } = AuthService.getCurrentUser();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");

  const addSubmerchant = async (formData) => {
    setPendingSubmit(true)
    setError("")
    try {
      await SubmerchantService.createSubmerchant(role, formData)
      navigate(`/${role}/submerchants`, { replace: true })
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
        <title>Add Merchant | {$APP_NAME}</title>
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
              <SubPageHeader title={t("Add Merchant")} actionRoute={`/${role}/submerchants`} actionTitle={t('Back')} />
            </Grid>
            <Grid item xs={12}>
              <SubmerchantDetails
                type="add"
                submerchantDetails={{}}
                handleSubmit={addSubmerchant}
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

export default AddSubmerchant;
