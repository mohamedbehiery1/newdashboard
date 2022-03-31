import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { OrderDetails as Details } from 'src/components/order';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { loadOrderDetails } from "src/store/orders";
import { useSelector, useDispatch } from 'react-redux';
import { omit } from 'lodash';
import orderService from 'src/__services__/orderService';
import AuthService from "src/__services__/AuthService";

const OrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { t } = useTranslation();
  const { id } = useParams();
  const { role } = AuthService.getCurrentUser();
  const source = location.state ? location.state.source : ""

  const order = useSelector(state => state.entities.orders.orderDetails);

  useEffect(_ => console.log(order), [order]);

  useEffect(() => {
    const params = [role, id];
    const notificationId = (new URLSearchParams(location.search)).get('notification');
    if (notificationId) {
      params.push(notificationId)
    }
    dispatch(loadOrderDetails(...params));
  }, [])

  // Profile Details
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingAssignDriver, setPendingAssignDriver] = useState(false);

  const [assignDriverError, setAssignDriverError] = useState()
  const [assignDriverSuccess, setAssignDriverSuccess] = useState()

  const editOrder = async (formData) => {
    formData = omit(formData, ['merchant'])
    setPendingSubmit(true);
    setError("");
    setSuccess("");
    try {
      await orderService.updateOrder(role, order.id, formData);
      setSuccess("Edited successfully");
    } catch (e) {
      console.log(e.response)
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteOrder = async (id) => {
    setPendingDelete(true)
    setError("")
    try {
      await orderService.deleteOrder(role, id)
      navigate(`/${role}/orders`, { replace: true })
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingDelete(false)
    }
  }

  const assignDriver = async driverId => {

    const orders = [order.id];
    const drivers = [{ driverId, count: orders.length }];
    setPendingAssignDriver(true);
    setAssignDriverError();
    setAssignDriverSuccess();
    try {
      await orderService.assignDriversToOrders(drivers, orders);
      setAssignDriverSuccess(t("Driver Assigned Successfully"));
      dispatch(loadOrderDetails(role, id));
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        setAssignDriverError(e.response.data.message);
      }
    } finally {
      setPendingAssignDriver(false);
    }
  }

  return (<>
    <Helmet>
      <title>Order Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("Order Details")} actionRoute={`/${role}/orders` + `/${source}`} actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <Details
              type="edit"
              orderDetails={order}
              handleSubmit={editOrder}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteOrder}
              pendingDelete={pendingDelete}
              handleAssignDriver={assignDriver}
              pendingAssignDriver={pendingAssignDriver}
              error={error}
              success={success}
              assignDriverError={assignDriverError}
              assignDriverSuccess={assignDriverSuccess}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
  )
}

export default OrderDetails;
