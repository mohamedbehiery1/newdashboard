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
import { has, concat } from 'lodash';
import AuthService from "src/__services__/AuthService";
import moment from "moment";
import 'moment/locale/ar';
import "react-perfect-scrollbar/dist/css/styles.css";
moment.locale(localStorage.getItem("i18nextLng"));

const $COLUMN_WIDTH = 150;

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

const DriverListResults = ({ 
  drivers,
  rowCount,
  pageSize,
  onPageChange,
  onSelectionModelChange,
  selectionModel,
  loading, 
  onResultSelect, 
  handleEditClick, 
  handleDeleteClick, 
  idsPendingDelete, 
  ...rest 
}) => {

  const { t } = useTranslation();
  const classes = useStyles();
  const { role } = AuthService.getCurrentUser();

  const renderCell = params => (
    <Typography>
      {params.value}
    </Typography>
  );

  const renderActionsCell = idsPendingDelete => params => (
    <Box >
      {/* <IconButton title={t("Edit")} color='secondary' aria-label="edit" onClick={_ => handleEditClick(params.value)}>
        <Edit />
      </IconButton> */}
      <LoadingButton title={t("Delete")} color='danger' loading={has(idsPendingDelete, params.value)} aria-label="delete" onClick={_ => handleDeleteClick(params.value)}>
        <Delete />
      </LoadingButton>
    </Box>
  );

  const getMerchantName = params => params.row.merchant && params.row.merchant.companyName
  const getPhone = params => `${params.row.phoneCode}${params.row.phone}`;
  const getOrderCount = params => params.row.orders.length;

  const columns = [
    { field: "name", headerName: t("Name"), width: $COLUMN_WIDTH * 1.3, renderCell },
    { field: "phone", valueGetter: getPhone, headerName: t("Phone"), width: $COLUMN_WIDTH * 1.3, renderCell },
    { field: "orderCount", headerName: t("Order Count"), width: $COLUMN_WIDTH, renderCell },
    { field: "debtor", headerName: t("Debtor"), width: $COLUMN_WIDTH, renderCell },
    { field: "orderCount", valueGetter: getOrderCount, headerName: t("Order Count"), width: $COLUMN_WIDTH * 1.3, renderCell },
    // { field: "id", resizable: false, headerName: " ", disableColumnMenu: true, disableClickEventBubbling: true, renderCell: renderActionsCell(idsPendingDelete), },
  ];
  const extraColumns = [
    { field: "merchantName", valueGetter: getMerchantName, headerName: t("Merchant Name"), width: $COLUMN_WIDTH * 1.3, renderCell },
  ]
  const getColumns = () => {
    return role === 'merchant' ? columns : concat(extraColumns, columns)
  }

  return (
    <Card  {...rest} sx={{ height: '100%' }}>
      <DataGrid
        style={{ overflowX: "auto" }}
        color='secondary'
        rows={drivers}
        columns={getColumns()}
        className={classes.root}
        disableSelectionOnClick
        // checkboxSelection
        loading={loading}
        localeText={generateDataGridLocaleText(t)}
        onRowClick={row => handleEditClick(row.id)}
        // autoPageSize
        pagination
        paginationMode="server"
        rowCount={rowCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </Card>
  );
};

DriverListResults.propTypes = {
  drivers: PropTypes.array.isRequired,
};

export default DriverListResults;
