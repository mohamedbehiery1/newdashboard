import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import OrderListResults from "./components/OrderListResults";
import OrderListToolbar from "./components/OrderListToolbar";
import { FollowUpOrderDialog } from "src/components";
import { $APP_NAME } from "src/constants";
import { useSelector, useDispatch } from "react-redux";
import { loadFollowupOrders, pageChanged } from "src/store/orders";
import { useNavigate , useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { set, omit, isEmpty, find, forEach, slice } from 'lodash';
import orderService from 'src/__services__/orderService';

const FollowUpOrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(loadFollowupOrders(1));
  }, []);

  const FollowUpOrderByChatSessionId = async (row) => {
    try {
      
     let chats = await orderService.FollowUpOrderByChatSessionId(row._id)
      let chatData = {}
      chatData.merchant = row.merchant
      chatData.user = row.inquiry.owner
      chatData.inquiryCode = row.inquiry.inquiryCode
      chatData.carModel = row.inquiry.carModel.name
      setChatData(chatData) 
      console.log("chaaaaaaaats",chats)
     setChatList(chats.data.body[0].calls)
     setDialogSettings({
        open: true,
        id: row._id
      });
    } catch (e) {
      if (e.response && e.response.data) {
        console.log(e.response)

      }
    }
  }

  const handleDetailsClick = row => {
    FollowUpOrderByChatSessionId(row)
    
  }

  const handleDismissDetails = _ => {
    setChatList([])
    setChatData({}) 
    setDialogSettings({
      open: false
    });
  };


  // Pagination
  const { list, loading, rowCount, pageSize, page } = useSelector(state => state.entities.orders);
  const [paginatedList, setPaginatedList] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [chatData, setChatData] = useState({});

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
        dispatch(loadFollowupOrders(actualTargetPage));
      } else {
        // loaded before
        dispatch(pageChanged({ page: actualTargetPage }));
        return;
      }
    }
  }


  const [dialogSettings, setDialogSettings] = useState({ open: false });
  const [IdsClicked, setIdsClicked] = useState({});

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
          <OrderListToolbar  />
          <Box sx={{ height: '90%', mt: 2 }}>
            <OrderListResults
              orders={paginatedList}
              rowCount={rowCount}
              pageSize={pageSize}
              loading={loading}
              onPageChange={onPageChange}
              selectionModel={selectionModel}
              onSelectionModelChange={onSelectionModelChange}
              idsClicked={IdsClicked}
              handleDetailsClick={handleDetailsClick}
            />
          </Box>
          <FollowUpOrderDialog
            title={t("Follow Up Order")}
            chats={chatList}
            chatData={chatData}
            MerchantName = {t('name')}
            open={dialogSettings.open}
            onClose={handleDismissDetails}
            fullWidth
            handleDismiss={handleDismissDetails}
          />
        </Container>
      </Box>
    </>
  );
};

export default FollowUpOrderList;
