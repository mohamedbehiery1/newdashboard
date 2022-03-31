import React, { useState, useCallback } from 'react';
import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { DriverDetails as Details } from 'src/components/driver';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from 'react';
import { loadDriverDetails } from "src/store/drivers";
import { useSelector, useDispatch } from 'react-redux';
import { omit, pick } from 'lodash';
import DriverService from 'src/__services__/driverService';
import AuthService from "src/__services__/AuthService";
import { ChangePasswordFor } from "src/components/common";
import { DriverBalanceDetails } from "./components";
import { ConfirmationDialog } from "src/components";
import moment from 'moment';
import { b64toBlob } from 'src/__utils__/base64Utils';
import { saveBlobToFile } from 'src/__utils__/blobUtils';

const DriverDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { role } = AuthService.getCurrentUser();

  const driver = useSelector(state => state.entities.drivers.driverDetails);

  useEffect(() => {
    dispatch(loadDriverDetails(role, id));
  }, [])

  // Profile Details
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pendingPasswordSubmit, setPendingPasswordSubmit] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const editDriver = async (formData) => {
    formData = omit(formData, ['merchant'])
    setPendingSubmit(true)
    setError("")
    setSuccess("");
    try {
      await DriverService.updateDriver(role, driver.id, formData);
      setSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteDriver = async (id) => {
    setPendingDelete(true)
    setError("")
    try {
      await DriverService.deleteDriver(role, id)
      navigate(`/${role}/drivers`, { replace: true })
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingDelete(false)
    }
  }

  const updatePassword = async (credentials) => {
    setPendingPasswordSubmit(true);
    setPasswordError();
    setPasswordSuccess();
    try {
      await DriverService.resetDriverPassword(role, id, credentials)
      setPasswordSuccess("Password changed successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        console.log(e.response)
        setPasswordError(e.response.data.message)
      }
    } finally {
      setPendingPasswordSubmit(false);
    }
  }

  //Download Balance Report
  const [pendingDownloadBalanceReport, setPendingDownloadBalanceReport] = useState(false);

  const downloadBalanceReport = async _ => {
    setPendingDownloadBalanceReport(true);
    try {
      const response = await DriverService.downloadBalanceReport(role, id);
      // xlsx: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      // xls: application/vnd.ms-excel
      const blob = b64toBlob(response.data.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      saveBlobToFile(blob, `${driver.name}_driver_report_${moment().locale("en").format("DD/MM/YYYY - hh:mm a")}.xlsx`);
      dispatch(loadDriverDetails(role, id));
    } catch (e) {
      console.log(e.response)
      if (e.response && e.response.data) {
        console.log(e.response.data.message)
      }
    } finally {
      setPendingDownloadBalanceReport(false)
    }
  }

  // Balance Details
  const [pendingSettleBalance, setPendingSettleBalance] = useState(false);
  const [settleBalanceError, setSettleBalanceError] = useState("");
  const [dialogSettings, setDialogSettings] = useState({ open: false });

  const handleSettleBalanceClick = _ => setDialogSettings({ open: true })

  const handleDismissSettleBalance = _ => setDialogSettings({ open: false })

  const handleConfirmSettleBalance = _ => {
    setDialogSettings({ open: false });
    settleBalance(id)
  }

  const settleBalance = async id => {
    setPendingSettleBalance(true);
    setSettleBalanceError("");
    try {
      await DriverService.settleDriverBalance(role, id);
      dispatch(loadDriverDetails(role, id));
    } catch (e) {
      console.log(e.response)
      if (e.response && e.response.data) {
        setSettleBalanceError(e.response.data.message)
      }
    } finally {
      setPendingSettleBalance(false)
    }
  }

  const getBalanceSettlementDisclaimer = useCallback(_ => {
    const { debtor, creditor } = driver;
    console.log(debtor, creditor);
    if (!debtor && !creditor) return;
    if (debtor > creditor) {
      return t("driverDebtorDisclaimer", { net: debtor - creditor })
    }
    if (creditor > debtor) {
      return t("driverCreditorDisclaimer", { net: creditor - debtor })
    }
  }, [driver]);

  return (<>
    <Helmet>
      <title>Driver Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("Driver Details")} actionRoute={`/${role}/drivers`} actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <Details
              type="edit"
              driverDetails={driver}
              handleSubmit={editDriver}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteDriver}
              pendingDelete={pendingDelete}
              error={error}
              success={success}
            />
          </Grid>
          {
            role === "merchant" &&
            <Grid item xs={12}>
              <DriverBalanceDetails
                balanceDetails={pick(driver, ['orders', 'debtor', 'settleBalanceDate'])}
                disclaimer={getBalanceSettlementDisclaimer()}
                handleSettle={handleSettleBalanceClick}
                pendingSettle={pendingSettleBalance}
                handleDownloadBalanceReport={downloadBalanceReport}
                pendingDownloadBalanceReport={pendingDownloadBalanceReport}
                error={settleBalanceError}
              />
            </Grid>
          }
          <Grid item md={6} xs={12}>
            <ChangePasswordFor
              handleSubmit={updatePassword}
              pending={pendingPasswordSubmit}
              error={passwordError}
              success={passwordSuccess}
            />
          </Grid>
        </Grid>
        <ConfirmationDialog
          title={t("Confirm Balance Settlement")}
          message={getBalanceSettlementDisclaimer()}
          open={dialogSettings.open}
          onClose={handleDismissSettleBalance}
          fullWidth
          handleDismiss={handleDismissSettleBalance}
          handleConfirm={handleConfirmSettleBalance}
        />
      </Container>
    </Box>
  </>
  )
}

export default DriverDetails;
