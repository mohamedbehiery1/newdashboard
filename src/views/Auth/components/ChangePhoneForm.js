import React, { useState } from "react";
import { Box, Typography, Link } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from "@material-ui/lab";
import MapitPhoneInput from "src/components/common/MapitPhoneInput";
import { ChangePhoneSchema } from '../ValidationSchemas';

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

const ChangePhoneForm = ({ onSubmit, pending }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const [phone, setPhone] = useState();
    const [validationError, setValidationError] = useState("");

    const handleChange = e => setPhone(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError("");
        if (!phone) {
            setValidationError("Invalid Phone Number");
            return
        }
        const error = runJoiValidate(ChangePhoneSchema, phone);
        if (error) {
            console.log(error)
            setValidationError(error);
            return
        }
        onSubmit(phone);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: '80%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ color: "#767676" }}>
                    {t("Phone Verification")}
                </Typography>
            </Box>
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <Typography variant="body1" sx={{ color: "#767676", textAlign: 'center', my: 2 }}>
                    {t("changePhoneDisclaimer")}
                </Typography>
                <MapitPhoneInput
                    label={t("Phone")}
                    name="phone"
                    value={phone}
                    handleChange={handleChange}
                    error={validationError}
                  />
                <LoadingButton
                    type="submit"
                    display="block"
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
                    {t("Confirm")}
                </LoadingButton>
            </form>
        </Box>
    );
};

export default ChangePhoneForm;
