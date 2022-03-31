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


const AdminListResults = ({
  admins,
  loading,
  rowCount,
  pageSize,
  onPageChange,
  onSelectionModelChange,
  selectionModel,
  handleEditClick,
  handleDeleteClick,
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

  const columns = [
    { field: "name", headerName: t("Name"), width: 200, renderCell },
    { field: "mobile", headerName: t("Email Address"), width: 200, renderCell },
    // { field: "id", resizable: false, disableColumnMenu: true, disableClickEventBubbling: true, headerName: t(" "), renderCell: renderActionsCell(idsPendingDelete), },
  ];


  return (
    <Card {...rest} sx={{ height: '100%' }}>
      {/* <PerfectScrollbar> */}
      <Box sx={{ minWidth: 800, height: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          color='secondary'
          rows={admins}
          columns={columns}
          className={classes.root}
          disableSelectionOnClick
          // checkboxSelection
          loading={loading}
          onRowClick={row => handleEditClick(row.id)}
          localeText={generateDataGridLocaleText(t)}
          // autoPageSize
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

AdminListResults.propTypes = {
  admins: PropTypes.array.isRequired,
};

export default AdminListResults;
