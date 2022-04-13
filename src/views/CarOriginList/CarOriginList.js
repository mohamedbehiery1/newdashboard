import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import CarOriginListResults from "./components/CarOriginListResults";
import CarOriginListToolbar from "./components/CarOriginListToolbar";
import { $APP_NAME } from "src/constants";
import { useSelector, useDispatch } from "react-redux";
import { loadCarOrigins, carOriginRemoved, pageChanged } from 'src/store/carOrigins';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from "src/components";
import { set, omit, isEmpty, filter, find, forEach, slice } from 'lodash';
import CarOriginService from "src/__services__/CarOriginService";
import moment from "moment";

const CarOriginList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Pagination
  useEffect(() => {
    dispatch(loadCarOrigins(1));
  }, []);

  // Pagination
  const { list, loading, rowCount, pageSize, page } = useSelector(state => state.entities.carOrigins);
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
        dispatch(loadCarOrigins(actualTargetPage))
      } else {
        // loaded before
        dispatch(pageChanged({ page: actualTargetPage }));
        return;
      }
    }
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
      await CarOriginService.deleteCarOrigin(id)
      dispatch(carOriginRemoved({ id }));
    } catch (e) {

    } finally {
      setIdsPendingDelete(omit(idsPendingDelete, id))
    }
  }

  return (
    <>
      <Helmet>
        <title>Car Orignis | {$APP_NAME}</title>
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
          <CarOriginListToolbar />
          <Box sx={{ height: '90%', mt: 2 }}>
            <CarOriginListResults
              carOrigins={paginatedList}
              rowCount={rowCount}
              pageSize={pageSize}
              loading={loading}
              onPageChange={onPageChange}
              selectionModel={selectionModel}
              onSelectionModelChange={onSelectionModelChange}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idsPendingDelete={idsPendingDelete}
            />
          </Box>
          <ConfirmationDialog
            title={t("Confirm Delete")}
            message={t("Car Origin will be deleted")}
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

export default CarOriginList;
