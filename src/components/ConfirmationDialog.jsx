import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';

const ConfirmationDialog = ({ title, message, handleDismiss, handleConfirm, ...rest }) => {

    const { t } = useTranslation();

    return (
        <Dialog
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            {...rest}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{textTransform: "none"}} name='cancel' color='main' onClick={handleDismiss}>
                    {t("Cancel")}
                </Button>
                <Button sx={{textTransform: "none"}} name='confirm' color='main' onClick={handleConfirm}>
                    {t("Confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog