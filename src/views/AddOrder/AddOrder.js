import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { OrderDetails } from 'src/components/order';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from "src/__services__/AuthService";
import orderService from 'src/__services__/orderService';

const AddOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role } = AuthService.getCurrentUser();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");

  const addOrder = async (formData) => {
    setPendingSubmit(true)
    setError("")
    try {
      await orderService.createOrder(role, formData)
      navigate(`/${role}/orders`, { replace: true })
    } catch (e) {
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
        <title>Add Order | {$APP_NAME}</title>
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
              <SubPageHeader title={t("Add Order")} actionRoute={`/${role}/orders`} actionTitle={t('Back')} />
            </Grid>
            <Grid item xs={12}>
              <OrderDetails
                type="add"
                handleSubmit={addOrder}
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

export default AddOrder;
