import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { MerchantProfileDetails } from 'src/components/merchant';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MerchantService from "src/__services__/MerchantService";

const AddMerchant = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");

  const addMerchant = async (formData) => {
    setPendingSubmit(true)
    setError("")
    try {
      await MerchantService.createMerchant(formData)
      navigate("/admin/merchants", { replace: true })
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
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
              <SubPageHeader title={t("Add Merchant")} actionRoute='/admin/merchants' actionTitle={t('Back')} />
            </Grid>
            <Grid item xs={12}>
              <MerchantProfileDetails
                type="add"
                // profileDetails={}
                handleSubmit={addMerchant}
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

export default AddMerchant;
