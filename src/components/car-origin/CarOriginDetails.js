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

const CarOriginDetails = ({
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
    if(type == 'edit'){
      if(profileDetails.name){
        setState({
          ...state,
          submitDisabled: isEmpty(profileDetails),
          profileDetails: {name_en: profileDetails.name.en, name_ar: profileDetails.name.ar}
        })
      }
    }else{
      setState({
        ...state,
        submitDisabled: isEmpty(profileDetails),
        profileDetails: pick(profileDetails, ['name_en', 'name_ar'] )
      })
    }

  }, [profileDetails])

  const editValidationSchema = Joi.object({
    name_en: Joi.string()
      .min(3)
      .required("required")
      .label("English Name"),
    name_ar: Joi.string()
      .min(3)
      .required("required")
      .label("Arabic Name")   
  });

  const addValidationSchema = Joi.object({
    name_en: Joi.string()
      .min(3)
      .required("required")
      .label("English Name"),
    name_ar: Joi.string()
      .min(3)
      .required("required")
      .label("Arabic Name")
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
    console.log("clicked")
    console.log(state.profileDetails)
    let data = {}
    data.names = [state.profileDetails.name_en, state.profileDetails.name_ar]
    data.langs= ['en', 'ar']
    handleSubmit(data);
  };

  const onDelete = (e) => {
    handleDelete(profileDetails.id)
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader
          title={t("Car Origin")}
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
              {t("Delete Car Origin")}
            </LoadingButton>
          }
        >
        </CardHeader>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <MapItTextField
                label={t("English Name")}
                name="name_en"
                value={state.profileDetails.name_en || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.name_en}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <MapItTextField
                label={t("Arabic Name")}
                name="name_ar"
                value={state.profileDetails.name_ar || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.name_ar}
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

export default CarOriginDetails;
