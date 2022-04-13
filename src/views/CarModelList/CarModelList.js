import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import CarModelListResults from "./components/CarModelListResults";
import CarModelListToolbar from "./components/CarModelListToolbar";
import { $APP_NAME } from "src/constants";
import { useSelector, useDispatch } from "react-redux";
import { loadCarModels, carModelRemoved, pageChanged } from 'src/store/carModels';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from "src/components";
import { set, omit, isEmpty, filter, find, forEach, slice } from 'lodash';
import CarModelService from "src/__services__/CarModelService";
import moment from "moment";

const CarModelList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Pagination
  useEffect(() => {
    dispatch(loadCarModels(1));
  }, []);

  // Pagination
  const { list, loading, rowCount, pageSize, page } = useSelector(state => state.entities.carModels);
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
        dispatch(loadCarModels(actualTargetPage))
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
      await CarModelService.deleteCarModel(id)
      dispatch(carModelRemoved({ id }));
    } catch (e) {

    } finally {
      setIdsPendingDelete(omit(idsPendingDelete, id))
    }
  }

  return (
    <>
      <Helmet>
        <title>Car Models | {$APP_NAME}</title>
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
          <CarModelListToolbar />
          <Box sx={{ height: '90%', mt: 2 }}>
            <CarModelListResults
              carModels={paginatedList}
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
            message={t("Car Model will be deleted")}
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

export default CarModelList;
