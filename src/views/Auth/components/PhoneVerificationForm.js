import React, { useState } from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from "@material-ui/lab";
import { MapItTextField } from "src/components/common";
import { PhoneVerificationSchema } from '../ValidationSchemas';

const useStyles = makeStyles((theme) => ({
    form: {
        width: "80%", // Fix IE 11 issue.
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    button: {
        '&:hover': {
            backgroundColor: '#00588C',
        },
    },
}));

const PhoneVerificationForm = ({ phone, onSubmit, onBack, pending, ...props }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const [otp, setOtp] = useState("")
    const [validationError, setValidationError] = useState("");

    const handleChange = e => setOtp(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError("");
        const error = runJoiValidate(PhoneVerificationSchema, otp);
        if (error) {
            console.log(error)
            setValidationError(error);
            return
        }
        console.log(otp)
        onSubmit(otp);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: '80%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ color: "#767676" }}>
                    {t("Phone Verification")}
                </Typography>
            </Box>
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <Typography variant="body1" sx={{ color: "#767676", textAlign: 'center', mt: 2 }}>
                    {t("phoneVerificationDisclaimer")}
                </Typography>
                <Typography variant="body1" sx={{ color: "#767676", textAlign: 'center', mb: 2 }}>
                    {phone}
                </Typography>
                <MapItTextField
                    label={t("OTP")}
                    size="small"
                    name="otp"
                    value={otp}
                    required={true}
                    handleChange={handleChange}
                    error={validationError}
                />
                <LoadingButton
                    type="submit"
                    display="block"
                    // fullWidth
                    disableElevation
                    variant="contained"
                    color="yellow"
                    className={classes.button}
                    sx={{
                        mt: 3,
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: 20,
                        px: 4,
                        py: 0.2,
                        marginInline: 'auto'
                    }}
                    loading={pending}
                >
                    {t("Verify")}
                </LoadingButton>
            </form>
            {
                onBack &&
                <Button
                    onClick={onBack}
                    display="block"
                    disableElevation
                    className={classes.button}
                    sx={{
                        mt: 3,
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: 20,
                        px: 4,
                        py: 0.2,
                        marginInline: 'auto'
                    }}
                >
                    {t("Back")}
                </Button>
            }
        </Box>
    );
};

export default PhoneVerificationForm;
