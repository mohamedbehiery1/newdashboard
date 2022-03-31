import PropTypes from "prop-types";
import {
  Box,
  Card,
  Typography,
  MenuItem
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { Visibility } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@material-ui/data-grid";
import { MapItTextField } from "src/components/common";
import { generateDataGridLocaleText } from "src/__utils__";
import ResponsiveReactPlayer from "../../../components/ResponsiveReactPlayer/ResponsiveReactPlayer"
import { LoadingButton } from '@material-ui/lab';
import { has } from 'lodash';


const useStyles = makeStyles({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
      outline: 'none',
    },
    '&.MuiDataGrid-root .MuiDataGrid-row': {
      cursor: "pointer"
    },
    fontSize: 14
  }
});


const OrderListResults = ({
  orders,
  loading,
  rowCount,
  pageSize,
  onPageChange,
  onSelectionModelChange,
  selectionModel,
  idsClicked,
  handleDetailsClick, 
  ...rest
}) => {

  const { t } = useTranslation();
  const classes = useStyles();

  const renderCell = params => (
    <Typography>
      {params.value}
    </Typography>
  );

  const renderActionsCell = idsClicked => params => (
    <Box >
      <LoadingButton title={t("Details")} loading={has(idsClicked, params.row)} aria-label="details" onClick={_ => handleDetailsClick(params.row)}>
        <Visibility />
      </LoadingButton>
    </Box>
  );


  const columns = [
    { field: `inquiryCode`, headerName: t("Inquiry Code"), sortable: false, filterable: false, width: 150, valueGetter: (params) =>{ return params.row.inquiry.inquiryCode } ,renderCell },
    { field: `merchantName`, headerName: t("Merchant Name"), sortable: false, filterable: false, width: 160, valueGetter: (params) =>{ return params.row.merchant.name } ,renderCell },
    // { field: `merchantPhone`, headerName: t("Merchant Phone"), sortable: false, filterable: false, width: 180, valueGetter: (params) =>{ return params.row.merchant.countryCode+params.row.merchant.mobile } ,renderCell },
    { field: `CustomerName`, headerName: t("Customer Name"), sortable: false, filterable: false, width: 180, valueGetter: (params) =>{ return params.row.inquiry.owner.name } ,renderCell },
    // { field: `Customerphone`, headerName: t("Customer Phone"), sortable: false, filterable: false, width: 180, valueGetter: (params) =>{ return params.row.inquiry.owner.countryCode+params.row.inquiry.owner.mobile } ,renderCell },
    // { field: `carModel`, headerName: t("Car Model"), sortable: false, filterable: false, width: 170, valueGetter: (params) =>{ return params.row.inquiry.carModel.name } ,renderCell },
    { field: `callStatus`, headerName: t("Call Status"), sortable: false, filterable: false, width: 170, valueGetter: (params) =>{ return typeof params.row.calls == 'object' ? t(params.row.calls.status) : '--'  } ,renderCell },
    { field: `record`, headerName: t("The Call"), sortable: false, filterable: false, width: 200, valueGetter: (params) =>{ return params.row.calls.record? <div style={{width: "200px"}} ><ResponsiveReactPlayer controls url={params.row.calls.record} /></div> : t('no call') } ,renderCell },
    { field: `createdAt`, headerName: t("Date"), sortable: false, filterable: false, valueGetter: (params) =>{ return moment(typeof params.row.calls == 'object' ? params.row.calls.createdAt : params.row.createdAt).locale("en").format("DD/MM/YYYY - hh:mm a") }  ,width: 210, renderCell },
    { field: "_id", resizable: false, headerName: " ", disableColumnMenu: true, disableClickEventBubbling: true, renderCell: renderActionsCell(idsClicked), },

    //   { field: `rate`, headerName: t("Rate"), sortable: false, filterable: false, width: 200, valueGetter: (params) => { return <div  style={{width: "200px"}} >
  //     <MapItTextField
  //     label={t("Rate")}
  //     name="rate"
  //     value={""}
  //     required={true}
  //     select
  // >
  //         <MenuItem key='1' value='1'>
  //             متعاون
  //         </MenuItem>
  //         <MenuItem key='2' value='2'>
  //             غشاش
  //         </MenuItem>
  // </MapItTextField>
  //   </div> } , renderCell },
  ];


  return (
    <Card {...rest} sx={{ height: '100%' }}>
      {/* <PerfectScrollbar> */}
      <Box sx={{ minWidth: 800, height: '100%' }}>
        <DataGrid
          getRowId={(row) => row.calls._id}
          color='secondary'
          rows={orders}
          columns={columns}
          className={classes.root}
          disableSelectionOnClick
          loading={loading}
          localeText={generateDataGridLocaleText(t)}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </Box>
      {/* </PerfectScrollbar> */}
    </Card>
  );
};

OrderListResults.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrderListResults;
