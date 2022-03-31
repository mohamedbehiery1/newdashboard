import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import AdminProfileDetails from 'src/components/admin-account/AdminProfileDetails';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { loadAdminDetails } from "src/store/admins";
import { useSelector, useDispatch } from 'react-redux';
import http from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const AdminDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(loadAdminDetails(id));
  }, [])

  const admin = useSelector(state => state.entities.admins.adminDetails);

  const editAdmin = async ({ name, email }) => {
    setPendingSubmit(true)
    setError("")
    setSuccess("");
    try {
      await http.put(`${apiUrl}/v1/admin-panel/admin/${admin.id}`, { name, email })
      setSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteAdmin = async (id) => {
    setPendingDelete(true)
    setError("")
    try {
      http.delete(`${apiUrl}/v1/admin-panel/admin/${id}`)
      navigate("/admin/admins", { replace: true })
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
      <title>Admin Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("Admin Details")} actionRoute='/admin/admins' actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <AdminProfileDetails
              type="edit"
              profileDetails={admin}
              handleSubmit={editAdmin}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteAdmin}
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

export default AdminDetails;
