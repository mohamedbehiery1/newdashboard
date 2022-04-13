import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import SpecialtyDetailsPage from 'src/components/specialty/SpecialtyDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { loadSpecialtyDetails } from "src/store/specialties";
import { useSelector, useDispatch } from 'react-redux';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const SpecialtyDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(loadSpecialtyDetails(id));
  }, [])

  const specialty = useSelector(state => state.entities.specialties.specialtyDetails);

  console.log("specialty", specialty)

  const editSpecialty = async (data) => {
    console.log(data)
    setPendingSubmit(true)
    setError("")
    setSuccess("");
    try {
      await http.put(`${apiUrl}/lookup/scrap-type/${id}`, data)
      setSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteSpecialty = async () => {
    setPendingDelete(true)
    setError("")
    try {
      http.delete(`${apiUrl}/lookup/scrap-type/${id}`)
      navigate("/admin/specialties", { replace: true })
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
      <title>Specialty  Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("Specialty Details")} actionRoute='/admin/specialties' actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <SpecialtyDetailsPage
              type="edit"
              profileDetails={specialty}
              handleSubmit={editSpecialty}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteSpecialty}
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

export default SpecialtyDetails;
