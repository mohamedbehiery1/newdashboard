import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography
} from "@material-ui/core";
import * as Joi from "joi";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from "@material-ui/lab";
import { MapItTextField } from "src/components/common";
import { isEmpty, pick } from 'lodash';

const AdminProfileDetails = ({
  type,
  profileDetails,
  handleSubmit,
  pendingSubmit,
  handleDelete,
  pendingDelete,
  error,
  success,
  ...props
}) => {

  const { t } = useTranslation();

  const [state, setState] = useState({ profileDetails: {} });

  useEffect(() => {
    setState({
      ...state,
      submitDisabled: isEmpty(profileDetails),
      profileDetails: pick(profileDetails, ['name', 'email', 'password', 'confirm'])
    })
  }, [profileDetails])

  const editValidationSchema = Joi.object({
    name: Joi.string()
      .min(3)
      .required("required")
      .label("Name"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required("required")
      .label("Email"),
  });

  const addValidationSchema = Joi.object({
    password: Joi.string()
      .required()
      .min(6)
      .label("Password"),
    confirm: Joi.any()
      .required()
      .valid(Joi.ref('password'))
      .label("Confirm password"),
  }).concat(editValidationSchema)

  const handleChange = (event) => {
    setState({
      ...state,
      profileDetails: {
        ...state.profileDetails,
        [event.target.name]: event.target.value,
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const schema = type === 'add' ? addValidationSchema : editValidationSchema
    const validationErrors = runJoiValidate(schema, state.profileDetails);
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    handleSubmit(state.profileDetails);
  };

  const onDelete = (e) => {
    handleDelete(profileDetails.id)
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader
          title={t("Profile")}
          action={type === "edit" &&
            <LoadingButton
              color="danger"
              variant="contained"
              disableElevation
              onClick={onDelete}
              loading={pendingDelete}
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {t("Delete Account")}
            </LoadingButton>
          }
        >
        </CardHeader>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <MapItTextField
                label={t("Name")}
                name="name"
                value={state.profileDetails.name || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <MapItTextField
                label={t("Email Address")}
                name="email"
                value={state.profileDetails.email || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.email}
              />
            </Grid>
            {
              type === 'add' &&
              <Fragment>
                <Grid item md={6} xs={12}>
                  <MapItTextField
                    label={t("Password")}
                    name="password"
                    type="password"
                    value={state.profileDetails.password || ""}
                    required={true}
                    handleChange={handleChange}
                    error={state.validationErrors && state.validationErrors.password}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <MapItTextField
                    label={t("Confirm password")}
                    name="confirm"
                    type="password"
                    value={state.profileDetails.confirm || ""}
                    required={true}
                    handleChange={handleChange}
                    error={state.validationErrors && state.validationErrors.confirm}
                  />
                </Grid>
              </Fragment>
            }
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
            disabled={(type === "edit" || type === 'profile') && state.submitDisabled}
            sx={{
              mt: 1,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {(type === "edit" || type === 'profile') && t("Save")}
            {type === "add" && t("Add")}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
};

export default AdminProfileDetails;
