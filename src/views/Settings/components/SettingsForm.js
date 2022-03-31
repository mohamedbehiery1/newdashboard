import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { MapItTextField } from "src/components/common";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
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

const SettingsForm = ({ handleSubmit, pendingSubmit, error, success, ...props }) => {
    const { t } = useTranslation();

    const getSettings = async _ => {
        const Authorization = "Bearer " + AuthService.getJwt();
        try {
            const response = await HttpService.get(
                `${apiUrl}/v1/admin-panel/setting`,
                { headers: { Authorization } }
            )
            const { body } = response.data
            const settings = pick(
                body,
                [
                    "facebook",
                    // "freeTrialDays",
                    "instagram",
                    "linkedin",
                    "privacy_ar",
                    "privacy_en",
                    "snapchat",
                    "terms_conditions_ar",
                    "terms_conditions_en",
                    "twitter",
                    "youtube",
                ]
            )
            setState(settings)
            console.log(settings)
        } catch (e) {
            console.log(e)
            if (e.response)
                console.log(e.response)
        }
    }

    useEffect(() => {
        getSettings()
    }, [])

    const [state, setState] = useState({});

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const validationSchema = Joi.object({
        // freeTrialDays: Joi.number()
        //     .min(1)
        //     .required()
        //     .label("No. of days"),
        facebook: Joi.string(),
        twitter: Joi.string(),
        instagram: Joi.string(),
        youtube: Joi.string(),
        snapchat: Joi.string(),
        linkedin: Joi.string(),
        privacy_ar: Joi.string(),
        privacy_en: Joi.string(),
        terms_conditions_ar: Joi.string(),
        terms_conditions_en: Joi.string(),
    })

    const onSubmit = (e) => {
        e.preventDefault();
        const schema = validationSchema
        const validationErrors = runJoiValidate(schema, omit(state, 'validationErrors'));
        setState({
            ...state,
            validationErrors
        });
        if (validationErrors) return;
        const updatedState = mapValues(
            state,
            (value, key) => key === 'freeTrialDays' ? Number(value) : value
        )
        handleSubmit(updatedState);
    };

    return (
        <form onSubmit={onSubmit} {...props}>
            <Card>
                {/* <CardHeader
                    title={t("Free Trial Settings")}
                /> */}
                {/* <Divider /> */}
                {/* <CardContent>
                    <Grid container spacing={3} wrap="wrap">
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("No. of days")}
                                name="freeTrialDays"
                                type="number"
                                value={state.freeTrialDays || ""}
                                required={true}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.freeTrialDays}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider /> */}
                <CardHeader
                    title={t("Social Media Settings")}
                />
                {/* <Divider /> */}
                <CardContent>
                    <Grid container spacing={3} wrap="wrap">
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("Facebook")}
                                name="facebook"
                                type="url"
                                value={state.facebook || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.facebook}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("Twitter")}
                                name="twitter"
                                type="url"
                                value={state.twitter || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.twitter}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("Instagram")}
                                name="instagram"
                                type="url"
                                value={state.instagram || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.instagram}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("Youtube")}
                                name="youtube"
                                type="url"
                                value={state.youtube || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.youtube}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("Snapchat")}
                                name="snapchat"
                                type="url"
                                value={state.snapchat || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.snapchat}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MapItTextField
                                label={t("LinkedIn")}
                                name="freeTrialDays"
                                type="url"
                                value={state.linkedin || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.linkedin}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardHeader
                    title={t("Privacy Policy")}
                />
                {/* <Divider /> */}
                <CardContent>
                    <Grid container spacing={3} wrap="wrap">
                        <Grid item xs={12}>
                            <MapItTextField
                                label={t("Arabic")}
                                name="privacy_ar"
                                // type=
                                value={state.privacy_ar || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.privacy_ar}
                                multiline
                                minRows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MapItTextField
                                label={t("English")}
                                name="privacy_en"
                                // type="url"
                                value={state.privacy_en || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.privacy_en}
                                multiline
                                minRows={3}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardHeader
                    title={t("Terms and Conditions")}
                />
                {/* <Divider /> */}
                <CardContent>
                    <Grid container spacing={3} wrap="wrap">
                        <Grid item xs={12}>
                            <MapItTextField
                                label={t("Arabic")}
                                name="terms_conditions_ar"
                                // type=
                                value={state.terms_conditions_ar || ""}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.terms_conditions_ar}
                                multiline
                                minRows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MapItTextField
                                label={t("English")}
                                name="terms_conditions_en"
                                // type="url"
                                value={state.terms_conditions_en || ""}
                                // required={true}
                                handleChange={handleChange}
                                error={state.validationErrors && state.validationErrors.terms_conditions_en}
                                multiline
                                minRows={3}
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
                        {t("Save")}
                    </LoadingButton>
                </Box>
            </Card>
        </form>
    );
};

export default SettingsForm;
