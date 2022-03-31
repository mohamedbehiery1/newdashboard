import PropTypes from "prop-types";
import {
  Box,
  Card,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { Delete, Edit, ReceiptOutlined } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@material-ui/data-grid";
import { generateDataGridLocaleText } from "src/__utils__";
import { LoadingButton } from '@material-ui/lab';
import { has, concat } from 'lodash';
import AuthService from "src/__services__/AuthService";
import moment from "moment";
import 'moment/locale/ar';
import PerfectScrollbar from 'react-perfect-scrollbar';

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

const SubmerchantListResults = ({ submerchants, loading, onResultSelect, handleEditClick, handleDeleteClick, idsPendingDelete, ...rest }) => {

  const { t } = useTranslation();
  const classes = useStyles();

  const renderCell = params => (
    <Typography>
      {params.value}
    </Typography>
  );

  const renderActionsCell = idsPendingDelete => params => (
    <Box flex={1} display="flex" justifyContent='flex-end'>
      {/* <IconButton title={t("Edit")} color='secondary' aria-label="edit" onClick={_ => handleEditClick(params.value)}>
        <Edit />
      </IconButton> */}
      <LoadingButton title={t("Delete")} color='danger' loading={has(idsPendingDelete, params.value)} aria-label="delete" onClick={_ => handleDeleteClick(params.value)}>
        <Delete />
      </LoadingButton>
    </Box>
  );

  const getNetBalance = params => params.row.creditor - params.row.debtor;

  const columns = [
    { field: "name", headerName: t("Name"), width: $COLUMN_WIDTH * 1.7, renderCell },
    { field: "price", headerName: t("Price"), width: $COLUMN_WIDTH, renderCell },
    { field: "creditor", headerName: t("Creditor"), width: $COLUMN_WIDTH, renderCell },
    { field: "debtor", headerName: t("Debtor"), width: $COLUMN_WIDTH, renderCell },
    { field: "netBalance", valueGetter: getNetBalance, headerName: t("Net Balance"), width: $COLUMN_WIDTH * 1.3, renderCell },
    // { field: "id", resizable: false, disableColumnMenu: true, disableClickEventBubbling: true, headerName: t(" "), renderCell: renderActionsCell(idsPendingDelete), },
  ];

  // const extraColumns = [
  //   { field: "merchantName", valueGetter: getMerchantName, headerName: t("Merchant Name"), width: $COLUMN_WIDTH * 1.1, renderCell },
  // ]

  // const getColumns = () => {
  //   const { role } = AuthService.getCurrentUser();
  //   return role === 'merchant' ? columns : concat(extraColumns, columns)
  // }

  return (
    <Card {...rest} sx={{ height: '100%' }}>
      {/* <PerfectScrollbar> */}
      <Box sx={{ minWidth: 800, height: '100%' }}>
        <DataGrid
          color='secondary'
          rows={submerchants}
          columns={columns}
          pageSize={10}
          className={classes.root}
          // autoPageSize
          disableSelectionOnClick
          // checkboxSelection
          loading={loading}
          // paginationMode='server'
          localeText={generateDataGridLocaleText(t)}
          onRowClick={row => handleEditClick(row.id)}
        />
      </Box>
      {/* </PerfectScrollbar> */}
    </Card>
  );
};

SubmerchantListResults.propTypes = {
  submerchants: PropTypes.array.isRequired,
};

export default SubmerchantListResults;
