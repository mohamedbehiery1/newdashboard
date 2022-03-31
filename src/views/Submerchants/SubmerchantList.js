import { Helmet } from "react-helmet";
import {
  Box,
  Container,
} from "@material-ui/core";
import { SubmerchantListResults, SubmerchantListToolbar } from './components';
import { $APP_NAME } from "src/constants";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { loadSubmerchants, submerchantRemoved } from 'src/store/submerchants';
import { useNavigate } from "react-router-dom";
import SubmerchantService from 'src/__services__/SubmerchantService';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from "src/components";
import { set, omit } from 'lodash';
import AuthService from "src/__services__/AuthService";

const SubmerchantList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { role } = AuthService.getCurrentUser()

  useEffect(() => {
    dispatch(loadSubmerchants(role));
  }, []);

  const { list, loading } = useSelector((state) => state.entities.submerchants);

  const onResultSelect = ({ row }, _) => {
    const id = row.id;
    navigate(id);
  }

  const handleEditClick = id => navigate(id);

  const [dialogSettings, setDialogSettings] = useState({ open: false });
  const [idsPendingDelete, setIdsPendingDelete] = useState({});

  const handleDeleteClick = id => {
    setDialogSettings({
      open: true,
      id
    });
  }

  const handleDismissDelete = _ => {
    setDialogSettings({
      open: false
    });
  };

  const handleConfirmDelete = _ => {
    const { id } = dialogSettings;
    setDialogSettings({
      open: false
    });
    processDelete(id)
  }

  const processDelete = async (id) => {
    setIdsPendingDelete(set(idsPendingDelete, id))
    try {
      await SubmerchantService.deleteSubmerchant(role, id)
      dispatch(submerchantRemoved({ id }));
    } catch (e) {

    } finally {
      setIdsPendingDelete(omit(idsPendingDelete, id))
    }
  }

  return (
    <>
      <Helmet>
        <title>Merchants | {$APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          display: 'flex',
          py: 2,
        }}
      >
        <Container maxWidth={false}>
          <SubmerchantListToolbar />
          <Box sx={{ height: '90%', mt: 2 }}>
            <SubmerchantListResults
              submerchants={list}
              loading={loading}
              onResultSelect={onResultSelect}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idsPendingDelete={idsPendingDelete}
            />
          </Box>
          <ConfirmationDialog
            title={t("Confirm Delete")}
            message={t("Merchant will be deleted")}
            open={dialogSettings.open}
            onClose={handleDismissDelete}
            fullWidth
            handleDismiss={handleDismissDelete}
            handleConfirm={handleConfirmDelete}
          />
        </Container>
      </Box>
    </>
  );
};

export default SubmerchantList;
