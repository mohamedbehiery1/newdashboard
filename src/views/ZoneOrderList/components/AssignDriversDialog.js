import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import ZoneAssignDriver from "./ZoneAssignDriver";
import { isEmpty } from 'lodash';
import { LoadingButton } from '@material-ui/lab';

const AssignDriversDialog = ({ title, extraTitle, message, settings, drivers, selectedDrivers, handleDismiss, handleConfirm, onAddDriver, onRemoveDriver, handleDriverSelect, pendingAssignDrivers, ...rest }) => {

    const { t } = useTranslation();
    return (
        <Dialog
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            {...rest}
            onClose={e => e.preventDefault}
        // maxWidth={'150px'}
        >
            <DialogTitle id="alert-dialog-title">{settings.multimode ? `${title} ${extraTitle}` : title}</DialogTitle>
            <DialogContent>
                {/* {
                    driverCount > 1 &&
                    <Typography variant="subtitle1">{t("Total Orders (24)")}</Typography>
                } */}
                <ZoneAssignDriver
                    drivers={drivers}
                    multiple={settings.multimode}
                    selectedDrivers={selectedDrivers}
                    handleChange={handleDriverSelect}
                />
                {/* {
                    [...Array(settings.driverCount).keys()].map(
                        (_, i) => {
                            return (
                                <ZoneAssignDriver shareNumber={settings.driverCount > 1 ? 23 / settings.driverCount : 0} onRemoveDriver={onRemoveDriver} canDelete={settings.driverCount > 1} />
                            )
                        }
                    )
                } */}
                {/* {
                    settings.multimode &&
                    drivers.length > settings.driverCount &&
                    <Button
                        sx={{ textTransform: "none", mt: 2 }}
                        color="main"
                        // variant="outlined"
                        onClick={onAddDriver}
                    >
                        {t('addAssignedDriver')}
                    </Button>
                } */}
            </DialogContent>
            <DialogActions>
                <Button disabled={pendingAssignDrivers} name='cancel' color='main' onClick={handleDismiss}>
                    {t("Cancel")}
                </Button>
                <LoadingButton
                    sx={{ textTransform: "none", marginInlineEnd: '16px', mx: 1 }}
                    color="main"
                    // variant="contained"
                    onClick={handleConfirm}
                    disabled={isEmpty(selectedDrivers)}
                    loading={pendingAssignDrivers}
                    disableElevation
                >
                    {t('Confirm')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default AssignDriversDialog