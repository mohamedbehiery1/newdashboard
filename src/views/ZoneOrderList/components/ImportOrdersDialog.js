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
import { isEmpty } from 'lodash';
import { LoadingButton } from '@material-ui/lab';
import { useEffect } from "react";
import { $BASE_URL } from "src/constants";
import AuthService from "src/__services__/AuthService";
import { OrderSubmerchantDetails } from "src/views/Submerchants/components";

const ImportOrdersDialog = ({
    onFileChosen,
    chosenFileDetails,
    submerchant,
    onSubmerchantChange,
    onClearSubmerchant,
    loading,
    error,
    handleDismiss,
    handleConfirm,
    ...rest
}) => {

    const { t } = useTranslation();
    const { roleType } = AuthService.getCurrentUser();

    useEffect(() => { console.log("loading changed", loading) }, [loading])

    return (
        <Dialog {...rest} >
            <DialogTitle>
                {t("importOrdersDialog.title")}
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1">
                    {t("importOrdersDialog.message")}
                </Typography>
                <Box sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1">
                        {t("importOrdersDialog.excelSchemaPropmt")}
                    </Typography>
                    <Button
                        disabled={false}
                        color='main'
                        sx={{ textTransform: "none" }}
                        href={`${$BASE_URL}/mapit_excel_schema.xls`}
                    >
                        {t("importOrdersDialog.clickHere")}
                    </Button>
                </Box>
                <Box sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                    <Button
                        color='main'
                        sx={{ textTransform: "none", fontWeight: 'bold', marginInlineEnd: '16px' }}
                        variant="contained"
                        component="label"
                    >
                        {t("importOrdersDialog.choose")}
                        <input
                            hidden
                            id="fileSelect"
                            name="file"
                            type="file"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={onFileChosen}
                        />
                    </Button>
                    {
                        chosenFileDetails &&
                        chosenFileDetails.name &&
                        <Typography variant="subtitle1"> {chosenFileDetails.name} </Typography>
                    }
                </Box>
                {
                    roleType === "SHIPPING_COMPANY" &&
                    <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
                        <Box sx={{ flex: 0.75 }}>
                            <OrderSubmerchantDetails
                                submerchant={submerchant}
                                handleChange={e => onSubmerchantChange(e.target.value)}
                                onClearClicked={onClearSubmerchant}
                            />
                        </Box>
                    </Box>
                }
                {
                    error &&
                    <Box sx={{ flexDirection: "column", display: "flex", alignItems: "flex-start" }}>
                        <Typography color='text.danger'>{error}</Typography>
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
                    {t("importOrdersDialog.cancel")}
                </Button>
                <LoadingButton
                    sx={{ textTransform: "none", marginInlineEnd: '16px', mx: 1 }}
                    color="main"
                    onClick={handleConfirm}
                    disabled={isEmpty(submerchant) || isEmpty(chosenFileDetails) || isEmpty(chosenFileDetails.base64)}
                    loading={loading}
                    disableElevation
                >
                    {t('importOrdersDialog.confirm')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default ImportOrdersDialog