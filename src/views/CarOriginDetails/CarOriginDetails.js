import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import CarOriginDetailsPage from 'src/components/car-origin/CarOriginDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { loadCarOriginDetails } from "src/store/carOrigins";
import { useSelector, useDispatch } from 'react-redux';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const CarOriginDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(loadCarOriginDetails(id));
  }, [])

  const carOrigin = useSelector(state => state.entities.carOrigins.carOriginDetails);

  const editCarOrigin = async (data) => {
    console.log(data)
    setPendingSubmit(true)
    setError("")
    setSuccess("");
    try {
      await http.put(`${apiUrl}/lookup/car-origin/${id}`, data)
      setSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteCarOrigin = async () => {
    setPendingDelete(true)
    setError("")
    try {
      http.delete(`${apiUrl}/lookup/car-origin/${id}`)
      navigate("/admin/car-origins", { replace: true })
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
      <title>Car Origin Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("Car Origin Details")} actionRoute='/admin/car-origins' actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <CarOriginDetailsPage
              type="edit"
              profileDetails={carOrigin}
              handleSubmit={editCarOrigin}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteCarOrigin}
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

export default CarOriginDetails;