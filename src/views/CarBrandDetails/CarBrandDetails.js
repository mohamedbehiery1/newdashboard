import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import CarBrandDetailsPage from 'src/components/car-brand/CarBrandDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { loadCarBrandDetails } from "src/store/carBrands";
import { useSelector, useDispatch } from 'react-redux';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const CarBrandDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(loadCarBrandDetails(id));
  }, [])

  const carBrand = useSelector(state => state.entities.carBrands.carBrandDetails);

  const editCarBrand = async (data) => {
    console.log(data)
    setPendingSubmit(true)
    setError("")
    setSuccess("");
    try {
      await http.put(`${apiUrl}/lookup/car-brand/${id}`, data)
      setSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteCarBrand = async () => {
    setPendingDelete(true)
    setError("")
    try {
      http.delete(`${apiUrl}/lookup/car-brand/${id}`)
      navigate("/admin/car-brands", { replace: true })
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
      <title>Car Brand Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("Car Brand Details")} actionRoute='/admin/car-brands' actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <CarBrandDetailsPage
              type="edit"
              profileDetails={carBrand}
              handleSubmit={editCarBrand}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteCarBrand}
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

export default CarBrandDetails;