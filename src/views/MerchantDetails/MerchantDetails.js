import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import MerchantDetailsPage from 'src/components/merchant/MerchantDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { loadMerchantDetails } from "src/store/merchants";
import { useSelector, useDispatch } from 'react-redux';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const MerchantDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(loadMerchantDetails(id));
  }, [])

  const merchant = useSelector(state => state.entities.merchants.merchantDetails);

  const editMerchant = async (data) => {
    console.log(data)
    setPendingSubmit(true)
    setError("")
    setSuccess("");
    try {
      await http.put(`${apiUrl}/merchant/${id}`, data)
      setSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteMerchant = async () => {
    setPendingDelete(true)
    setError("")
    try {
      http.delete(`${apiUrl}/merchant/${id}`)
      navigate("/admin/merchants", { replace: true })
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingDelete(false)
    }
  }

  return (<>
    <Helmet>
      <title>Merchant Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("Merchant Details")} actionRoute='/admin/merchants' actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <MerchantDetailsPage
              type="edit"
              profileDetails={merchant}
              handleSubmit={editMerchant}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteMerchant}
              pendingDelete={pendingDelete}
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

export default MerchantDetails;