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


const UserListResults = ({
  users,
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
    { field: "name", headerName: t("Name"),  flex: 1, renderCell },
    { field: "countryCode", headerName: t("Country Code"),flex: 1, renderCell },
    { field: "mobile", headerName: t("Mobile"), flex : 1, renderCell },
    { field: "otp", headerName: t("OTP"), flex : 1 , renderCell },
    // { field: "id", resizable: false, disableColumnMenu: true, disableClickEventBubbling: true, headerName: t(" "), renderCell: renderActionsCell(idsPendingDelete), },
  ];


  return (
    <Card {...rest} sx={{ height: '100%' }}>
      {/* <PerfectScrollbar> */}
      <Box sx={{ minWidth: 800, height: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          color='secondary'
          rows={users}
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

UserListResults.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UserListResults;
