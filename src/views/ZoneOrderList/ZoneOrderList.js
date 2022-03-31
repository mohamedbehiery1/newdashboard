import { Helmet } from "react-helmet";
import { Container, Box } from "@material-ui/core";
import ZoneOrderListResults from "./components/ZoneOrderListResults";
import ZoneOrderListToolbar from "./components/ZoneOrderListToolbar";
import { $APP_NAME } from "src/constants";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { loadOrdersByStatus } from 'src/store/orders';

import { useTranslation } from 'react-i18next';
import AssignDriversDialog from "./components/AssignDriversDialog";
import ImportOrdersDialog from "./components/ImportOrdersDialog";
import PrintAWBsDialog from "./components/PrintAWBsDialog";
import { findIndex, map, forEach, isEmpty, find, flatMap } from 'lodash';
import AuthService from "src/__services__/AuthService";
import HttpService from 'src/__services__/httpService';
import OrderService from 'src/__services__/orderService';
import { $BASE_URL } from "src/constants";
import { loadDrivers } from "src/store/drivers";
import { generatePDF } from 'src/__utils__/pdfUtils';
import AWB from "src/views/AWB";

const apiUrl = $BASE_URL + '/api';
var moment = require('moment-timezone');

const ZoneOrderList = ({ type, ...props }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { role, roleType } = AuthService.getCurrentUser()
  const Authorization = "Bearer " + AuthService.getJwt();

  const { list: drivers } = useSelector((state) => state.entities.drivers);
  const { lastOrderTime, unassignedZones, loading } = useSelector((state) => state.entities.orders);

  const [inAssignDriverMode, setInAssignDriverMode] = useState(false);
  const [dialogSettings, setDialogSettings] = useState({ open: false });
  const [selectedZones, setSelectedZones] = useState([])
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [pendingAssignDrivers, setPendingAssignDrivers] = useState(false);
  const [filters, setFilters] = useState([{ title: t("All"), value: "all" }]);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);

  const [importOrdersDialogSettings, setImportOrdersDialogSettings] = useState({ open: false, loading: false });
  const [selectedExcelFileDetails, setSelectedExcelFileDetails] = useState();
  const [selectedSubmerchant, setSelectedSubmerchant] = useState();
  const [printAWBsDialogSettings, setPrintAWBsDialogSettings] = useState({ open: false, loading: false });

  const allSubmerchants = useSelector(state => {
    let list = state.entities.submerchants.list
    return list
  });

  useEffect(() => {
    dispatch(loadOrdersByStatus(role, type));
    //TODO: change to autocomplete to fix issue with pagination
    dispatch(loadDrivers(role, 1));
  }, []);

  useEffect(() => {
    if (type !== "new" || !lastOrderTime) return;
    const h = lastOrderTime.slice(0, 2);
    const referenceTime = moment().tz("Asia/Riyadh").set({ h, m: 0, s: 0 });
    const nowTime = moment().tz("Asia/Riyadh");
    if (nowTime.isBefore(referenceTime))
      referenceTime.subtract(1, 'days');
    setFilters([
      ...filters,
      {
        title: t("Untill") + " " + referenceTime.locale(i18n.dir() === 'rtl' ? 'ar' : 'en').format("dddd h:00 A"),
        value: referenceTime.unix(),
      },
    ])
  }, [lastOrderTime])

  const handleDriverSelect = e => {
    if (dialogSettings.multimode) {
      const zone = find(unassignedZones, unassigned => unassigned._id === selectedZones[0]);
      if (e.target.value.length > zone.orders.length) return;
    }
    setSelectedDrivers(e.target.value)
  };

  const handleAssignDriversClick = _ => {
    setInAssignDriverMode(true)
  }

  const handleOnAssignClick = _ => {
    setDialogSettings({
      ...dialogSettings,
      open: true,
      multimode: selectedZones.length === 1
    });
  }

  const handleOnFinishClick = _ => {
    setSelectedZones([]);
    setInAssignDriverMode(false);
  }

  const divideOrdersAmongDrivers = (orders, driversArr) => {
    let ordersCount = orders.length;
    let drivers = [...driversArr];
    do {
      drivers.forEach(driver => {
        if (ordersCount === 0) return;
        ordersCount = ordersCount - 1;
        driver.count = Number(driver.count) ? driver.count + 1 : 1
      })
    } while (ordersCount > 0);
    return drivers;
  }

  // const handleAddDriver = _ => {
  //   if (dialogSettings.driverCount === drivers.length) return;
  //   setDialogSettings({
  //     ...dialogSettings,
  //     driverCount: dialogSettings.driverCount + 1
  //   });
  // }

  // const handleRemoveDriver = _ => {
  //   setDialogSettings({
  //     ...dialogSettings,
  //     driverCount: dialogSettings.driverCount - 1
  //   });
  // }

  const handleDismissDelete = _ => {
    setDialogSettings({
      open: false
    });
    setSelectedDrivers([])
  };

  const handleConfirmDriverSelection = _ => {
    if (isEmpty(selectedZones)) return;
    const params = { orders: [], drivers: [] };
    forEach(selectedZones, zoneId => {
      const zoneDetails = find(unassignedZones, unassigned => unassigned._id === zoneId);
      const zoneOrders = map(zoneDetails.orders, order => order._id);
      params.orders.push(...zoneOrders);
    })
    if (Array.isArray(selectedDrivers)) {
      forEach(selectedDrivers, driverId => {
        const driverDetails = find(drivers, driver => driver.id === driverId);
        params.drivers.push({ driverId: driverDetails.id });
      })
      const driversWithAssignedQuotas = divideOrdersAmongDrivers(params.orders, params.drivers);
      params.drivers = driversWithAssignedQuotas
    } else {
      params.drivers = [{ driverId: selectedDrivers, count: params.orders.length }]
    }
    assignDriversToOrders(params);
  }

  const assignDriversToOrders = async params => {
    console.log(params);
    setPendingAssignDrivers(true);
    try {
      await HttpService.post(
        `${apiUrl}/v1/merchant-dashboard/order/assign-drivers`,
        params,
        { headers: { Authorization } }
      )
      setDialogSettings({
        open: false
      });
      handleRefresh()
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
      }
    } finally {
      setPendingAssignDrivers(false);
    }
  }

  const handleZoneSelect = (zoneId, isCurrentlyChecked) => {
    if (isCurrentlyChecked) {
      setSelectedZones(selectedZones.filter(value => value !== zoneId));
    } else {
      setSelectedZones([...selectedZones, zoneId]);
    }
  };

  const handleFilterChange = e => {
    const filterIndex = findIndex(filters, filter => filter.title === e.target.value)
    setSelectedFilterIndex(filterIndex);
  }

  const handleRefresh = _ => {
    dispatch(loadOrdersByStatus(role, type));
  }

  const handleImportClicked = useCallback(_ => {
    setImportOrdersDialogSettings({
      ...importOrdersDialogSettings,
      open: true,
    });
  }, [importOrdersDialogSettings]);

  const handleDismissImportDialog = _ => {
    setImportOrdersDialogSettings({
      ...importOrdersDialogSettings,
      open: false,
    });
    setSelectedSubmerchant();
    setSelectedExcelFileDetails(null);
  }

  const handleConfirmImportDialog = async _ => {
    const params = { base64: selectedExcelFileDetails.base64 }
    if (role === "merchant" && roleType === "SHIPPING_COMPANY" && selectedSubmerchant) {
      params.subMerchant = selectedSubmerchant
    }
    setImportOrdersDialogSettings({ ...importOrdersDialogSettings, loading: true })
    try {
      const { data } = await OrderService.importOrdersFromSpreadsheet(role, params);
      setImportOrdersDialogSettings({ ...importOrdersDialogSettings, open: false, loading: false, error: undefined })
      setSelectedExcelFileDetails()
      setSelectedSubmerchant()
      handleRefresh()
    } catch (e) {
      const error = e.response && e.response.data ? e.response.data.message : null
      setImportOrdersDialogSettings({ ...importOrdersDialogSettings, loading: false, error })
    }
  }

  const handleExcelFileChosen = e => {
    const reader = new FileReader();
    const file = e.target.files[0];
    const fileName = file.name;
    reader.addEventListener("load", function () {
      const fileDetails = { name: fileName, base64: reader.result };
      setSelectedExcelFileDetails({ ...fileDetails });
    }, false);
    return reader.readAsDataURL(file);
  }

  const handlePrintAWBsClicked = useCallback(_ => {
    setPrintAWBsDialogSettings({
      ...printAWBsDialogSettings,
      open: true,
    });
  }, [printAWBsDialogSettings])

  const handleDismissPrintAWBsDialog = _ => {
    setPrintAWBsDialogSettings({
      ...printAWBsDialogSettings,
      open: false,
    });
    setSelectedSubmerchant();
  }

  const [ordersToPrint, setOrdersToPrint] = useState();
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleConfirmPrintAWBsDialog = async _ => {
    if (!selectedSubmerchant) return;
    setPrintAWBsDialogSettings({ ...printAWBsDialogSettings, loading: true })
    try {
      const response = await OrderService.getNewOrdersForSubmerchant(role, selectedSubmerchant);
      const { body: orders } = response.data;
      const flattenedAWBs = flatMap(orders, order => {
        const arr = []
        forEach(order.barCode, barCode => arr.push({ ...order, barCode }))
        return arr
      })
      setOrdersToPrint(flattenedAWBs)
      setLoadingPDF(true);
      const { name: subMerchantName } = find(allSubmerchants, submerchant => submerchant.id === selectedSubmerchant);
      setTimeout(_ => generatePDF(
        map(flattenedAWBs, awb => awb.barCode),
        "awb",
        "display",
        `${subMerchantName}_AWBs_${moment().locale("en").format("DD/MM/YYYY")}`,
        _ => {
          setLoadingPDF(false);
          setOrdersToPrint();
          setSelectedSubmerchant();
          setPrintAWBsDialogSettings({ ...printAWBsDialogSettings, open: false, loading: false, error: undefined })
        }
      ), 500)
    } catch (e) {
      const error = e.response && e.response.data ? e.response.data.message : null
      setPrintAWBsDialogSettings({ ...printAWBsDialogSettings, loading: false, error })
    }
  }

  const handleSubmerchantChange = submerchant => setSelectedSubmerchant(submerchant)

  const handleClearSubmerchant = _ => setSelectedSubmerchant();

  return (
    <>
      <Helmet>
        <title>Orders | {$APP_NAME}</title>
      </Helmet>
      {/* <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          display: 'flex',
          py: 2,
        }}
      > */}
      <Container sx={{ py: 2, height: '100%', display: 'flex', flexDirection: 'column' }} >
        <ZoneOrderListToolbar
          type={type}
          handleFilterChange={handleFilterChange}
          filters={filters}
          selectedFilterIndex={selectedFilterIndex}
          onAssignDriversClick={handleAssignDriversClick}
          onFinishClick={handleOnFinishClick}
          onAssignClick={handleOnAssignClick}
          inAssignDriverMode={inAssignDriverMode}
          isAssignDisabled={isEmpty(selectedZones)}
          onImportClick={handleImportClicked}
          onPrintAWBsClick={handlePrintAWBsClicked}
          actionButtonsDisabled={isEmpty(unassignedZones)}
        />
        <ZoneOrderListResults
          type={type}
          loading={loading}
          unassignedZones={unassignedZones}
          selectedZones={selectedZones}
          inAssignDriverMode={inAssignDriverMode}
          filter={filters[selectedFilterIndex].value}
          refresh={handleRefresh}
          handleZoneSelect={handleZoneSelect}
        />
        {dialogSettings.open &&
          <AssignDriversDialog
            type={type}
            title={t("Assign Drivers")}
            extraTitle={t("(Multiple drivers allowed)")}
            settings={dialogSettings}
            drivers={drivers}
            selectedDrivers={selectedDrivers}
            open={dialogSettings.open}
            onClose={handleDismissDelete}
            fullWidth
            handleDismiss={handleDismissDelete}
            handleConfirm={handleConfirmDriverSelection}
            // onAddDriver={handleAddDriver}
            // onRemoveDriver={handleRemoveDriver}
            handleDriverSelect={handleDriverSelect}
            pendingAssignDrivers={pendingAssignDrivers}
          />
        }
        {type === "new" && importOrdersDialogSettings.open &&
          <ImportOrdersDialog
            fullWidth
            open={importOrdersDialogSettings.open}
            loading={importOrdersDialogSettings.loading}
            error={importOrdersDialogSettings.error}
            onClose={handleDismissImportDialog}
            handleDismiss={handleDismissImportDialog}
            handleConfirm={handleConfirmImportDialog}
            onFileChosen={handleExcelFileChosen}
            chosenFileDetails={selectedExcelFileDetails}
            submerchant={selectedSubmerchant}
            onSubmerchantChange={handleSubmerchantChange}
            onClearSubmerchant={handleClearSubmerchant}
          />
        }
        {type === "new" && printAWBsDialogSettings.open &&
          <PrintAWBsDialog
            fullWidth
            roleType={roleType}
            submerchant={selectedSubmerchant}
            onSubmerchantChange={handleSubmerchantChange}
            loading={printAWBsDialogSettings.loading || loadingPDF}
            handleDismiss={handleDismissPrintAWBsDialog}
            handleConfirm={handleConfirmPrintAWBsDialog}
            onClose={handleDismissPrintAWBsDialog}
            open={printAWBsDialogSettings.open}
          />
        }
      </Container>
      {/* </Box> */}
      {
        !isEmpty(ordersToPrint) &&
        <Box>
          {
            map(
              ordersToPrint,
              order => (<AWB style={{ display: "none" }} key={order.barCode.text} id={`awb${order.barCode.text}`} order={order} />)
            )
          }
        </Box>
      }
    </>
  );
};

export default ZoneOrderList;
