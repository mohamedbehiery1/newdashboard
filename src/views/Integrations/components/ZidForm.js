import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { MapItTextField } from "src/components/common";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    Typography,
} from "@material-ui/core";
import * as Joi from "joi";
import runJoiValidate from "src/__utils__/runJoiValidate";
import HttpService from 'src/__services__/httpService';
import AuthService from "src/__services__/AuthService";
import { mapValues, omit, pick } from 'lodash';
import { LoadingButton } from '@material-ui/lab';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const ZidForm = ({ handleSubmit, pendingSubmit, error, success, ...props }) => {
    const { t } = useTranslation();

    const getIntegrations = async _ => {
        const Authorization = "Bearer " + AuthService.getJwt();
        try {
            const response = await HttpService.get(
                `${apiUrl}/v1/merchant-dashboard/integrations`,
                { headers: { Authorization } }
            )
            const { zid } = response.data.body
            setState({ ...state, active: zid.active });
        } catch (e) {
            console.log(e)
            if (e.response)
                console.log(e.response)
        }
    }

    useEffect(() => {
        getIntegrations()
    }, [])

    const [state, setState] = useState({});

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const validationSchema = Joi.object({
        managerToken: Joi.string()
            .min(1)
            .required()
            .label("Manager Token"),
        storeId: Joi.string()
            .min(1)
            .required()
            .label("Store ID"),
    })

    const onSubmit = (e) => {
        e.preventDefault();
        const schema = validationSchema;
        const params = pick(state, ['managerToken', 'storeId']);
        const validationErrors = runJoiValidate(schema, params);
        setState({
            ...state,
            validationErrors
        });
        if (validationErrors) return;
        handleSubmit(params);
    };

    return (
        <form onSubmit={onSubmit} {...props}>
            <Card>
                <CardHeader
                    title={t("Zid")}
                    titleTypographyProps={{
                        variant: 'h3'
                    }}
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={3} wrap="wrap">
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '20px' }} color="main">
                                {t("Status")}:
                                <Typography display="inline" sx={{ marginInlineStart: 5, fontSize: '22px' }} color={state.active ? "success.main" : "text.danger"}>
                                    {t(state.active ? "Activated" : "Not Activated")}
                                </Typography>
                            </Typography>
                            <Typography sx={{ fontSize: '20px' }} color='main'>
                                {t("You need to provide Manager Token and Store ID from Zid dashboard in order to integrate")}
                            </Typography>
                            <Typography sx={{ fontSize: '18px' }} color='main'>
                                {t("Settings -> Link Services -> Create Manager Token")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("X-Manager-Token")}
                                name="managerToken"
                                value={state.managerToken || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.managerToken}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("Store ID")}
                                name="storeId"
                                value={state.storeId || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.storeId}
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
                        loading={pendingSubmit}
                        sx={{
                            mt: 1,
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        {t(state.active ? "Reactivate" : "Activate")}
                    </LoadingButton>
                </Box>
            </Card>
        </form>
    );
};

export default ZidForm;
