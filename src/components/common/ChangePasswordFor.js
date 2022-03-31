import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Grid
} from "@material-ui/core";
import { MapItTextField } from "src/components/common";
import * as Joi from "joi";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from '@material-ui/lab';

const ChangePasswordFor = ({ handleSubmit, pending, error, success, ...rest }) => {

    const { t } = useTranslation();

    const [credentials, setCredentials] = useState({ password: "", confirm: "" });
    const [validationErrors, setValidationErrors] = useState();

    useEffect(_ => {
        if (success) {
            setCredentials({ password: "", confirm: "", })
        }
    }, [success])

    const handleChange = (event) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value,
        });
    };

    const validationSchema = Joi.object({
        password: Joi.string()
            .required()
            .min(6)
            .label("Password"),
        confirm: Joi.any()
            .required()
            .valid(Joi.ref('password'))
            .label("Confirm password"),
    })

    const onSubmit = (e) => {
        e.preventDefault();
        setValidationErrors(null);
        const schema = validationSchema
        const errors = runJoiValidate(schema, credentials);
        if (errors) {
            setValidationErrors(errors);
            return;
        } else {
            handleSubmit(credentials);
        }
    };

    return (
        <form onSubmit={onSubmit} autoComplete="off" noValidate {...rest}>
            <Card>
                <CardHeader title={t("Reset Password")} />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MapItTextField
                                label={t("New Password")}
                                size="small"
                                name="password"
                                type="password"
                                value={credentials.password || ""}
                                required={true}
                                handleChange={handleChange}
                                error={validationErrors && validationErrors.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MapItTextField
                                label={t("Confirm password")}
                                size="small"
                                name="confirm"
                                type="password"
                                value={credentials.confirm || ""}
                                required={true}
                                handleChange={handleChange}
                                error={validationErrors && validationErrors.confirm}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: error || success ? "space-between" : "flex-end",
                        alignItems: 'center',
                        p: 2,
                    }}
                >
                    {error && <Typography color='text.danger'>{t(error)}</Typography>}
                    {success && <Typography color='success.main'>{t(success)}</Typography>}
                    <LoadingButton
                        color="main"
                        variant="contained"
                        disableElevation
                        type="submit"
                        loading={pending}
                        sx={{
                            mt: 1,
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        {t("Update")}
                    </LoadingButton>
                </Box>
            </Card>
        </form>
    );
};

export default ChangePasswordFor;
