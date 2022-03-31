import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Container,
} from "@material-ui/core";
import DriverListResults from "./components/DriverListResults";
import DriverListToolbar from "./components/DriverListToolbar";
import { $APP_NAME } from "src/constants";
import { useSelector, useDispatch } from "react-redux";
import { loadDrivers, driverRemoved, pageChanged } from 'src/store/drivers';
import { useNavigate } from "react-router-dom";
import driverService from 'src/__services__/driverService';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from "src/components";
import { set, omit, isEmpty, slice } from 'lodash';
import AuthService from "src/__services__/AuthService";

const DriverList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { role } = AuthService.getCurrentUser()

  useEffect(() => {
    dispatch(loadDrivers(role, 1));
  }, []);

  // Pagination
  const { list, loading, rowCount, pageSize, page } = useSelector(state => state.entities.drivers);
  const [paginatedList, setPaginatedList] = useState([]);

  const [selectionModel, setSelectionModel] = useState([]);
  const prevSelectionModel = useRef(selectionModel);
  const onSelectionModelChange = (newSelectionModel) => setSelectionModel(newSelectionModel);

  useEffect(() => {
    const sliceStart = pageSize * (page - 1);
    const sliceEnd = pageSize * page;
    const rowsToDisplay = slice(list, sliceStart, sliceEnd);
    if (!isEmpty(rowsToDisplay)) {
      setPaginatedList(rowsToDisplay);
    }

  }, [list, rowCount, pageSize, page]);

  useEffect(() => {
    setTimeout(() => {
      setSelectionModel(prevSelectionModel.current);
    }, 150);
  }, [page])

  // Pagination
  const onPageChange = targetPage => {
    // Save selectionModel
    prevSelectionModel.current = selectionModel;
    const actualTargetPage = targetPage + 1;
    if (actualTargetPage < page) {
      // navigating back
      dispatch(pageChanged({ page: actualTargetPage }));
      return;
    } else {
      // navigating forward
      const numberOfPagesLoaded = Math.ceil(list.length / pageSize);
      if (actualTargetPage > numberOfPagesLoaded) {
        // not loaded before
        dispatch(loadDrivers(role, actualTargetPage));
      } else {
        // loaded before
        dispatch(pageChanged({ page: actualTargetPage }));
        return;
      }
    }
  }

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
      await driverService.deleteDriver(role, id)
      dispatch(driverRemoved({ id }));
    } catch (e) {

    } finally {
      setIdsPendingDelete(omit(idsPendingDelete, id))
    }
  }

  return (
    <>
      <Helmet>
        <title>Drivers | {$APP_NAME}</title>
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
          <DriverListToolbar />
          <Box sx={{ height: '90%', mt: 2 }}>
            <DriverListResults
              drivers={paginatedList}
              loading={loading}
              rowCount={rowCount}
              pageSize={pageSize}
              onPageChange={onPageChange}
              selectionModel={selectionModel}
              onSelectionModelChange={onSelectionModelChange}
              onResultSelect={onResultSelect}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idsPendingDelete={idsPendingDelete}
            />
          </Box>
          <ConfirmationDialog
            title={t("Confirm Delete")}
            message={t("Driver will be deleted")}
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

export default DriverList;
