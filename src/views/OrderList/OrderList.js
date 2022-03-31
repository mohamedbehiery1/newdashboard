import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import OrderListResults from "./components/OrderListResults";
import OrderListToolbar from "./components/OrderListToolbar";
import { $APP_NAME } from "src/constants";
import { useSelector, useDispatch } from "react-redux";
import { loadOrders, loadBendingOrders ,pageChanged } from "src/store/orders";
import { useNavigate , useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { set, omit, isEmpty, find, forEach, slice } from 'lodash';

const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { type } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
      dispatch(loadOrders(1, type));    
  }, [type]);

  // Pagination
  const { list, loading, rowCount, pageSize, page } = useSelector(state => state.entities.orders);
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
        dispatch(loadOrders(actualTargetPage, type));
      } else {
        // loaded before
        dispatch(pageChanged({ page: actualTargetPage }));
        return;
      }
    }
  }


  const [dialogSettings, setDialogSettings] = useState({ open: false });
  const [idsPendingDelete, setIdsPendingDelete] = useState({});

  return (
    <>
      <Helmet>
        <title>Orders | {$APP_NAME}</title>
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
          <OrderListToolbar pageType='new' />
          <Box sx={{ height: '90%', mt: 2 }}>
            <OrderListResults
              orders={paginatedList}
              rowCount={rowCount}
              pageSize={pageSize}
              loading={loading}
              onPageChange={onPageChange}
              selectionModel={selectionModel}
              onSelectionModelChange={onSelectionModelChange}
              idsPendingDelete={idsPendingDelete}
            />
          </Box>

        </Container>
      </Box>
    </>
  );
};

export default OrderList;
