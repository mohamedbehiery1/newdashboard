import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  MenuItem
} from "@material-ui/core";
import * as Joi from "joi";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from "@material-ui/lab";
import { MapItTextField } from "src/components/common";
import { isEmpty, pick } from 'lodash';
import http from 'src/__services__/httpService';
import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const CarBrandDetails = ({
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

  const [state, setState] = useState({ profileDetails: {}, carOrigins: [] });

  useEffect( async () => {

    let carOriginsData = await http.get(apiUrl+'/lookup/car-origin/all')
    
    if(type == 'edit'){
      if(profileDetails.name){
        setState({
          ...state,
          submitDisabled: isEmpty(profileDetails),
          profileDetails: {name_en: profileDetails.name.en, name_ar: profileDetails.name.ar, carOrigin: profileDetails.carOrigin},
          carOrigins: carOriginsData.data.body
        })
      }
    }else{
      setState({
        ...state,
        submitDisabled: isEmpty(profileDetails),
        profileDetails: pick(profileDetails, ['name_en', 'name_ar', 'carOrigin'] ),
        carOrigins: carOriginsData.data.body
      })
    }

    console.log("profile",profileDetails)

  }, [profileDetails])



  const editValidationSchema = Joi.object({
    name_en: Joi.string()
      .min(3)
      .required("required")
      .label("English Name"),
    name_ar: Joi.string()
      .min(3)
      .required("required")
      .label("Arabic Name"),
    carOrigin: Joi.string()
      .required("required")
      .label("Car Origin")       
  });

  const addValidationSchema = Joi.object({
    name_en: Joi.string()
      .min(3)
      .required("required")
      .label("English Name"),
    name_ar: Joi.string()
      .min(3)
      .required("required")
      .label("Arabic Name"),
    carOrigin: Joi.string()
      .required("required")
      .label("Car Origin")  
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
    data.carOrigin = state.profileDetails.carOrigin
    handleSubmit(data);
  };

  const onDelete = (e) => {
    handleDelete(profileDetails.id)
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader
          title={t("Car Brand")}
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
              {t("Delete Car Brand")}
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
            <Grid item md={12} xs={12} >
                  <MapItTextField
                    label={t("Car Origin")}
                    name="carOrigin"
                    handleChange={handleChange}
                    value={state.profileDetails.carOrigin || ""}
                    required={true}
                    select
                    error={state.validationErrors && state.validationErrors.carOrigin}
                    >
                            {state.carOrigins.map((origin) => (
                                <MenuItem key={origin.id} value={origin.id}>
                                    {origin.name}
                                </MenuItem>
                            ))}
                </MapItTextField>
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

export default CarBrandDetails;
