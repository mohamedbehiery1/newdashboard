import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Typography,
    Box,
    MenuItem,
    Grid,
    Divider
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ResponsiveReactPlayer from './ResponsiveReactPlayer/ResponsiveReactPlayer'
import { makeStyles } from '@material-ui/styles';
import { MapItTextField } from "src/components/common";


const useStyles = makeStyles({
    root: {
      '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
        outline: 'none',
      },
      '&.MuiDataGrid-root .MuiDataGrid-row': {
        cursor: "pointer"
      },
      fontSize: 14
    },
    title: {
        backgroundColor: '#00588C',
        color: 'white'
    }
  });

const FollowUpOrderDialog = ({ title,chats, chatData, MerchantName ,handleDismiss, ...rest }) => {

    const { t } = useTranslation();
    const classes = useStyles();
    const rowCount = chats.length

    const renderCell = params => (
        <Typography>
          {params.value}
        </Typography>
      );

    const columns = [
        { field: `fromMerchant`, headerName: t("From Merchant?"), sortable: false, filterable: false, width: 160, valueGetter: (params) =>{ return params.row.fromMerchant? t('Yes') : t('No') } ,renderCell },
        { field: `FromUser`, headerName: t("From User?"), sortable: false, filterable: false, width: 180, valueGetter: (params) =>{ return params.row.fromUser? t('Yes') : t('No') } ,renderCell },
        { field: `callStatus`, headerName: t("Call Status"), sortable: false, filterable: false, width: 170, valueGetter: (params) =>{ return t(params.row.status)  } ,renderCell },
        { field: `record`, headerName: t("The Call"), sortable: false, filterable: false, width: 200, valueGetter: (params) =>{ return params.row.record? <div style={{width: "200px"}} ><ResponsiveReactPlayer controls url={params.row.record} /></div> : t('no call') } ,renderCell },
        { field: `createdAt`, headerName: t("Date"), sortable: false, filterable: false, valueGetter: (params) =>{ return moment(params.row.createdAt).locale("en").format("DD/MM/YYYY - hh:mm a") }  ,width: 210, renderCell },
      ];

    return (
        <Dialog
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
            {...rest}
        >
            <DialogTitle className={classes.title} id="alert-dialog-title">{title} {chatData?.inquiryCode}</DialogTitle>
            <Box sx={{ ml: 3, mr: 3, mt: 2 }} >
  
            <Typography>
                {t('Merchant Name')} : {chatData.merchant?.name}
            </Typography>
            <Typography>
                {t('Merchant Phone')} : {chatData.merchant?.countryCode}{chatData.merchant?.mobile}
            </Typography>
            <Typography>
                {t('User Name')} : {chatData.user?.name}
            </Typography>
            <Typography>
                {t('User Phone')} : {chatData.user?.countryCode}{chatData.user?.mobile}
            </Typography>
            <Typography mb={2} >
                {t('Car Model')} : {chatData?.carModel}
            </Typography>
            <Divider />
            <Grid item mt={2} md={4} xs={12} >
            <MapItTextField
                    label={t("Rate")}
                    name="rate"
                    value={""}
                    required={true}
                    select
                >
                        <MenuItem key='1' value='1'>
                            متعاون
                        </MenuItem>
                        <MenuItem key='2' value='2'>
                            غشاش
                        </MenuItem>
                </MapItTextField>
            </Grid>

            <Grid item mt={2} md={4} xs={12} >
                <Button color="main" variant="contained">
                    {t("Save")}
                </Button>
            </Grid>

            </Box>
            <DialogContent>
                    <DataGrid
                        getRowId={(row) => row._id}
                        color='secondary'
                        rows={chats}
                        columns={columns}
                        className={classes.root}
                        disableSelectionOnClick
                        rowCount={rowCount}
                        pageSize={7}
                    />

            </DialogContent>
            <DialogActions>
                <Button sx={{textTransform: "none"}} name='cancel' color='main' onClick={handleDismiss}>
                    {t("Cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FollowUpOrderDialog