import PropTypes from "prop-types";
import {
  Box,
  Card,
  Typography,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { Delete } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@material-ui/data-grid";
import { generateDataGridLocaleText } from "src/__utils__";
import { LoadingButton } from '@material-ui/lab';
import { has } from 'lodash';

const useStyles = makeStyles({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
      outline: 'none',
    },
    '&.MuiDataGrid-root .MuiDataGrid-row': {
      cursor: "pointer"
    }
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
  idsPendingDelete,
  ...rest
}) => {

  const { t } = useTranslation();
  const classes = useStyles();

  const renderCell = params => (
    <Typography>
      {params.value}
    </Typography>
  );


  const columns = [
    { field: `inquiryCode`, headerName: t("Inquiry Code"),  flex: 1 ,renderCell },
    { field: `ownerName`, headerName: t("Customer Name"),  flex: 1, valueGetter: (params) =>{ return params.row.owner.name } ,renderCell },
    { field: "ownerPhone", headerName: t("Customer Phone"),flex: 1, valueGetter: (params) =>{ return params.row.owner.countryCode+params.row.owner.mobile } ,renderCell },
    { field: "carModel", headerName: t("Car Model"),flex: 1, valueGetter: (params) =>{ return params.row.carModel.name } ,renderCell },
    { field: "carBrand", headerName: t("Car Brand"),flex: 1, valueGetter: (params) =>{ return params.row.carModel.carBrand.name } ,renderCell },
    // { field: "mobile", headerName: t("Mobile"), flex : 1, renderCell },
    // { field: "otp", headerName: t("OTP"), flex : 1 , renderCell },
    // { field: "id", resizable: false, disableColumnMenu: true, disableClickEventBubbling: true, headerName: t(" "), renderCell: renderActionsCell(idsPendingDelete), },
  ];


  return (
    <Card {...rest} sx={{ height: '100%' }}>
      {/* <PerfectScrollbar> */}
      <Box sx={{ minWidth: 800, height: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
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
