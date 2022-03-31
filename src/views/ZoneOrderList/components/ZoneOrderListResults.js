import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Checkbox,
  Grid,
  CircularProgress
} from "@material-ui/core";
import { Link } from 'react-router-dom';
import { DoubleArrowRounded } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { filter as _filter, forEach, pick, isEmpty, map, includes } from 'lodash';
import AuthService from "src/__services__/AuthService";
import moment from "moment";
import 'moment/locale/ar';
import ZoneOrderListDriver from "./ZoneOrderListDriver";
import PerfectScrollbar from "react-perfect-scrollbar";
import HttpService from 'src/__services__/httpService';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

moment.locale(localStorage.getItem("i18nextLng"));

const ZoneHeaderView = ({ type, zone, refresh, isChecked, handleCheckboxClick, inSelectionMode }) => {

  const { t, i18n } = useTranslation();
  const Authorization = "Bearer " + AuthService.getJwt();
  // LastOrderTime
  const [pendingAssignDriver, setPendingAssignDriver] = useState(false);

  const handleAssignDriver = async driverId => {
    const orders = map(zone.orders, order => order._id)
    const params = { orders, drivers: [{ driverId, count: orders.length }] }

    setPendingAssignDriver(true);
    try {
      await HttpService.post(
        `${apiUrl}/v1/merchant-dashboard/order/assign-drivers`,
        params,
        { headers: { Authorization } }
      )
      refresh()
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data) {
        console.log(e.response)
      }
    } finally {
      setPendingAssignDriver(false);
    }
  }

  return (
    <Grid item xs={12} md={inSelectionMode ? 6 : 12}>
      <Paper sx={{ px: 3, py: 1, display: "flex", flexDirection: "row", alignItems: "center" }} >
        {inSelectionMode &&
          <Checkbox
            // {...label}
            // defaultChecked
            onClick={_ => handleCheckboxClick(zone._id, isChecked)}
            checked={isChecked}
            color="main"
            sx={{ '& .MuiSvgIcon-root': { fontSize: 30 }, marginInlineEnd: '16px' }}
          />
        }
        <Box sx={{ display: "flex", flexDirection: 'column', flex: 1 }}>
          <Typography sx={{ fontSize: 12, }}>{t("Zone") + ":"}</Typography>
          <Typography mt={-0.7} sx={{ fontSize: 20, fontWeight: 'bold' }}>
            {
              !!zone._id
                ?
                zone.properties.name
                :
                t("Unlocated")
            }
          </Typography>
        </Box>
        {
          type === "new" && // !!zone._id &&
          (
            inSelectionMode || <ZoneOrderListDriver handleSubmit={handleAssignDriver} pending={pendingAssignDriver} />
          )
        }
        <Box sx={{ mx: 1 }}>
          <Typography sx={{ fontSize: 20 }}>({zone.orders.length})</Typography>
        </Box>
        {inSelectionMode ||
          <Box>
            <IconButton component={Link} to={`/merchant/orders/${type}/${zone._id}`}>
              <DoubleArrowRounded color="secondary" sx={{ fontSize: 30, transform: i18n.dir() === 'rtl' ? 'scale(-1, 1)' : '' }} />
            </IconButton>
          </Box>
        }
      </Paper>
    </Grid>
  )
}

const ZoneOrderListResults = ({ type, loading, refresh, filter, unassignedZones, selectedZones, handleZoneSelect, inAssignDriverMode }) => {

  const { t } = useTranslation();

  const [filteredZones, setFilteredZones] = useState([]);

  useEffect(_ => {
    if (filter === "all") {
      setFilteredZones(unassignedZones);
      return;
    }
    var filtered = []
    forEach(
      unassignedZones,
      zone => {
        const editedZone = pick(zone, ["_id", "properties", "orders"]);
        editedZone.orders = _filter(editedZone.orders, order => moment(order.createdAt).isBefore(moment.unix(filter)))
        if (!isEmpty(editedZone.orders)) {
          filtered.push(editedZone)
        }
      }
    )
    setFilteredZones(filtered)
  }, [filter, unassignedZones])

  return (
    // <Card {...rest} >
    <Box sx={{ flexGrow: 1, p: 1 }} >
      <PerfectScrollbar>
        {
          loading
            ?
            <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress color="main" />
            </Box>
            :
            (isEmpty(filteredZones)
              ?
              <Box sx={{ display: "flex", height: '100%' }}>
                <Typography sx={{ margin: "auto" }} variant="h1" textAlign='center'>
                  {t("No Orders")}
                </Typography>
              </Box>
              :
              <Grid container rowSpacing={2} columnSpacing={2} sx={{ alignContent: 'flex-start' }} >
                {
                  filteredZones.map(
                    zone =>
                      <ZoneHeaderView
                        key={zone._id}
                        type={type}
                        refresh={refresh}
                        zone={zone}
                        inSelectionMode={inAssignDriverMode}
                        isChecked={includes(selectedZones, zone._id)}
                        handleCheckboxClick={handleZoneSelect}
                      />
                  )
                }
              </Grid>
            )
        }
      </PerfectScrollbar>
    </Box>
    // </Card>
  );
};

ZoneOrderListResults.propTypes = {

};

export default ZoneOrderListResults;
