import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    Box,
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@material-ui/lab';
import { OrderSubmerchantDetails } from "src/views/Submerchants/components";
import { isEmpty } from "lodash";

const PrintAWBsDialog = ({
    roleType,
    submerchant,
    onSubmerchantChange,
    loading,
    handleDismiss,
    handleConfirm,
    ...rest
}) => {

    const { t } = useTranslation();

    return (
        <Dialog {...rest} >
            <DialogTitle>
                {t("printAWBsDialog.title")}
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1">
                    {t(`printAWBsDialog.message.${roleType === "SHIPPING_COMPANY" ? "shippingCompany" : "regularMerchant"}`)}
                </Typography>
                {
                    roleType === "SHIPPING_COMPANY" &&
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
                        <Box sx={{ flex: 0.75 }}>
                            <OrderSubmerchantDetails
                                submerchant={submerchant}
                                handleChange={e => onSubmerchantChange(e.target.value)}
                            />
                        </Box>
                    </Box>
                }
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={false}
                    color='main'
                    onClick={handleDismiss}
                    sx={{ textTransform: "none" }}
                >
                    {t("printAWBsDialog.cancel")}
                </Button>
                <LoadingButton
                    sx={{ textTransform: "none", marginInlineEnd: '16px', mx: 1 }}
                    color="main"
                    onClick={handleConfirm}
                    disabled={roleType === "SHIPPING_COMPANY" ? isEmpty(submerchant) : false}
                    loading={loading}
                    disableElevation
                >
                    {t('printAWBsDialog.confirm')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default PrintAWBsDialog