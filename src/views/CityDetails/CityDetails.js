import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import CityDetailsPage from 'src/components/city/CityDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { loadCityDetails } from "src/store/cities";
import { useSelector, useDispatch } from 'react-redux';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const CityDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(loadCityDetails(id));
  }, [])

  const city = useSelector(state => state.entities.cities.cityDetails);

  const editCity = async (data) => {
    console.log(data)
    setPendingSubmit(true)
    setError("")
    setSuccess("");
    try {
      await http.put(`${apiUrl}/lookup/city/${id}`, data)
      setSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteCity = async () => {
    setPendingDelete(true)
    setError("")
    try {
      http.delete(`${apiUrl}/lookup/city/${id}`)
      navigate("/admin/cities", { replace: true })
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
      <title>City Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("City Details")} actionRoute='/admin/cities' actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <CityDetailsPage
              type="edit"
              profileDetails={city}
              handleSubmit={editCity}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteCity}
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

export default CityDetails;
