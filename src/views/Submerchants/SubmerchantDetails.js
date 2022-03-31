import { Helmet } from "react-helmet";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { SubmerchantDetails as Details, SubmerchantBalanceDetails } from './components';
import { useTranslation } from 'react-i18next';
import SubPageHeader from "src/components/subpage-header";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { loadSubmerchantDetails } from "src/store/submerchants";
import { useSelector, useDispatch } from 'react-redux';
import { omit, pick } from 'lodash';
import SubmerchantService from 'src/__services__/SubmerchantService';
import AuthService from "src/__services__/AuthService";
import { ConfirmationDialog } from "src/components";
import moment from 'moment';
import { b64toBlob } from 'src/__utils__/base64Utils';
import { saveBlobToFile } from 'src/__utils__/blobUtils';

const SubmerchantDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { role } = AuthService.getCurrentUser();

  const submerchant = useSelector(state => state.entities.submerchants.submerchantDetails);

  useEffect(() => {
    dispatch(loadSubmerchantDetails(role, id));
  }, [])

  // Profile Details
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const editSubmerchant = async (formData) => {
    formData = omit(formData, ['merchant'])
    setPendingSubmit(true)
    setError("")
    setSuccess("");
    try {
      await SubmerchantService.updateSubmerchant(role, submerchant.id, formData);
      setSuccess("Edited successfully");
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const deleteSubmerchant = async _ => {
    setPendingDelete(true)
    setError("")
    try {
      await SubmerchantService.deleteSubmerchant(role, id)
      navigate(`/${role}/submerchants`, { replace: true })
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingDelete(false)
    }
  }

  //Download Balance Report
  const [pendingDownloadBalanceReport, setPendingDownloadBalanceReport] = useState(false);

  const downloadBalanceReport = async _ => {
    setPendingDownloadBalanceReport(true);
    try {
      const response = await SubmerchantService.downloadBalanceReport(role, id);
      const blob = b64toBlob(response.data.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      saveBlobToFile(blob, `${submerchant.name}_merchant_report_${moment().locale("en").format("DD/MM/YYYY - hh:mm a")}.xlsx`);
      dispatch(loadSubmerchantDetails(role, id));
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
      await SubmerchantService.settleSubmerchantBalance(role, id);
      dispatch(loadSubmerchantDetails(role, id));
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
    const { debtor, creditor } = submerchant;
    if (!debtor && !creditor) return;
    if (debtor > creditor) {
      return t("debtorDisclaimer", { net: debtor - creditor })
    }
    if (creditor > debtor) {
      return t("creditorDisclaimer", { net: creditor - debtor })
    }
  }, [submerchant]);

  return (<>
    <Helmet>
      <title>Merchant Details | {$APP_NAME}</title>
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
            <SubPageHeader title={t("Merchant Details")} actionRoute={`/${role}/submerchants`} actionTitle={t('Back')} />
          </Grid>
          <Grid item xs={12}>
            <Details
              type="edit"
              submerchantDetails={submerchant}
              handleSubmit={editSubmerchant}
              pendingSubmit={pendingSubmit}
              handleDelete={deleteSubmerchant}
              pendingDelete={pendingDelete}
              error={error}
              success={success}
            />
          </Grid>
          <Grid item xs={12}>
            <SubmerchantBalanceDetails
              balanceDetails={pick(submerchant, ['creditor', 'debtor', 'settleBalanceDate'])}
              disclaimer={getBalanceSettlementDisclaimer()}
              handleSettle={handleSettleBalanceClick}
              pendingSettle={pendingSettleBalance}
              handleDownloadBalanceReport={downloadBalanceReport}
              pendingDownloadBalanceReport={pendingDownloadBalanceReport}
              error={settleBalanceError}
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

export default SubmerchantDetails;
