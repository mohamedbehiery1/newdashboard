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
import { omit } from 'lodash';
import { LoadingButton } from '@material-ui/lab';

const SettingsPassword = ({ handleSubmit, pendingSubmit, error, success, ...rest }) => {

  const { t } = useTranslation();

  const [state, setState] = useState({
    currentPassword: "",
    password: "",
    confirm: "",
  });

  useEffect(_ => {
    if (success) {
      setState({
        currentPassword: "",
        password: "",
        confirm: "",
      })
    }
  }, [success])

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const validationSchema = Joi.object({
    currentPassword: Joi.string()
      .required()
      // .min(3)
      .label("Old Password"),
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
    const schema = validationSchema
    const validationErrors = runJoiValidate(schema, omit(state, 'validationErrors'));
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    handleSubmit(state);
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...rest}>
      <Card>
        <CardHeader title={t("Password")} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MapItTextField
                label={t("Current Password")}
                name="currentPassword"
                type="password"
                value={state.currentPassword || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.currentPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <MapItTextField
                label={t("New Password")}
                name="password"
                type="password"
                value={state.password || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <MapItTextField
                label={t("Confirm password")}
                name="confirm"
                type="password"
                value={state.confirm || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.confirm}
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
            {t("Update")}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
};

export default SettingsPassword;
