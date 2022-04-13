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

const MerchantDetails = ({
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
  let theCountryCode = '+965'
  if(localStorage.getItem("country")){
    if(localStorage.getItem("country") == '6184aea034e78407518074e8'){
       theCountryCode = '+965'
    }else{
      theCountryCode = '+971'
    }
  }else{
    theCountryCode = '+965'
  }

  const [state, setState] = useState({ profileDetails: {}, carOrigins: [], carBrands: [], carModels: [], cities: [], specialties: [] });

  useEffect( async () => {

    let carOriginsData = await http.get(apiUrl+'/lookup/car-origin/all')
    let cities = await http.get(apiUrl+'/lookup/cities-by-country/'+localStorage.getItem("country") || "6184aea034e78407518074e8")
    let specialties = await http.get(apiUrl+'/lookup/scrap-type/all')
    if(type == 'edit'){
      if(profileDetails.name){
        let carBrandsData = await http.get(apiUrl+'/lookup/car-brand/car-origin/'+profileDetails.carBrand.carOrigin)
        setState({
          ...state,
          submitDisabled: isEmpty(profileDetails),
          profileDetails: {name_en: profileDetails.name.en, name_ar: profileDetails.name.ar, carOrigin: profileDetails.carBrand.carOrigin, carBrand: profileDetails.carBrand._id },
          carOrigins: carOriginsData.data.body,
          carBrands: carBrandsData.data.body,
          carModels: carBrandsData.data.body,
          cities: carBrandsData.data.body,          
        })
      }
    }else{
      setState({
        ...state,
        submitDisabled: isEmpty(profileDetails),
        profileDetails: pick(profileDetails, ['name_en', 'name_ar', 'mobile', 'fullName', 'speakingLangs' ,'carOrigin', 'carBrand', 'carModel', 'city', 'specialty', 'commission' ] ),
        carOrigins: carOriginsData.data.body,
        cities: cities.data.body,
        specialties: specialties.data.body
      })
    }


  }, [profileDetails])



  const editValidationSchema = Joi.object({
    name_en: Joi.string()
      .required("required")
      .label("English Name"),
    name_ar: Joi.string()
      .required("required")
      .label("Arabic Name"),
    fullName: Joi.string()
      .required("required")
      .label("Owner Name"),  
    mobile: Joi.string()
      .required("required")
      .label("Mobile"),      
    carOrigin: Joi.string()
      .required("required")
      .label("Car Origin"),
    carBrand: Joi.string()
      .required("required")
      .label("Car Brand"),
    carModel: Joi.array()
      .required("required")
      .label("Car Model"),
    city: Joi.string()
      .required("required")
      .label("City"),
    specialty: Joi.array()
      .required("required")
      .label("Specialty"),
    commission: Joi.number()
      .required("required")
      .label("Commission"),   
    speakingLangs: Joi.string()
    .required("required")
    .label("Language")               
           
  });
  

  const addValidationSchema = Joi.object({
    name_en: Joi.string()
      .required("required")
      .label("English Name"),
    name_ar: Joi.string()
      .required("required")
      .label("Arabic Name"),
    fullName: Joi.string()
      .required("required")
      .label("Owner Name"), 
    mobile: Joi.string()
      .required("required")
      .label("Mobile"),    
    carOrigin: Joi.string()
      .required("required")
      .label("Car Origin"),
    carBrand: Joi.string()
      .required("required")
      .label("Car Brand"), 
    carModel: Joi.array()
      .required("required")
      .label("Car Model"),      
    city: Joi.string()
      .required("required")
      .label("City"),
    commission: Joi.number()
      .required("required")
      .label("Commission"),    
    specialty: Joi.array()
      .required("required")
      .label("Specialty"),
    speakingLangs: Joi.string()
      .required("required")
      .label("Language")             
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

  const handleCarOriginChange = async (event) => {
    let carBrandsData = await http.get(apiUrl+'/lookup/car-brand/car-origin/'+event.target.value)
    setState({
      ...state,
      profileDetails: {
        ...state.profileDetails,
        [event.target.name]: event.target.value,
      },
      carBrands: carBrandsData.data.body
    });
  };

  const handleCarBrandChange = async (event) => {
    let carModels = state.carBrands.find(x => x.id === event.target.value).carModels;
    setState({
      ...state,
      profileDetails: {
        ...state.profileDetails,
        [event.target.name]: event.target.value,
      },
      carModels: carModels
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
    let data = {}
    data.names = [state.profileDetails.name_en, state.profileDetails.name_ar]
    data.langs= ['en', 'ar']
    data.fullName = state.profileDetails.fullName
    data.speakingLangs = [state.profileDetails.speakingLangs]
    data.countryCode = theCountryCode
    data.mobile = state.profileDetails.mobile
    data.city = state.profileDetails.city
    data.commission = state.profileDetails.commission
    data.scrapTypes = state.profileDetails.specialty
    data.carModels = state.profileDetails.carModel
    console.log("Inserted Data", data)
    handleSubmit(data);
  };

  const onDelete = (e) => {
    handleDelete(profileDetails.id)
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader
          title={t("Merchant")}
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
              {t("Delete Merchant")}
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
            <Grid item md={2} xs={12}>
              <MapItTextField
                label={t("Country Code")}
                name="countryCode"
                value={theCountryCode}
                disabled
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.countryCode}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <MapItTextField
                label={t("Mobile")}
                name="mobile"
                value={state.profileDetails.mobile || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.mobile}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <MapItTextField
                label={t("Owner Name")}
                name="fullName"
                value={state.profileDetails.fullName || ""}
                required={true}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.fullName}
              />
            </Grid>

            <Grid item md={6} xs={12} >
                  <MapItTextField
                    label={t("Language")}
                    name="speakingLangs"
                    handleChange={handleChange}
                    value={state.profileDetails.speakingLangs || ''}
                    required={true}
                    select
                    error={state.validationErrors && state.validationErrors.speakingLangs}
                    >
                            {/* {state.carOrigins.map((origin) => ( */}
                                <MenuItem key={'61df0d396fd78716c972aaf5'} value={'61df0d396fd78716c972aaf5'}>
                                    اللغه العربيه
                                    {/* {origin.name} */}
                                </MenuItem>
                            {/* ))} */}
                </MapItTextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <MapItTextField
                label={t("Commission")}
                name="commission"
                value={state.profileDetails.commission || ""}
                required={true}
                type="number"
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.commission}
              />
            </Grid>

            <Grid item md={6} xs={12} >
                  <MapItTextField
                    label={t("City")}
                    name="city"
                    handleChange={handleChange}
                    value={state.profileDetails.city || ""}
                    required={true}
                    select
                    error={state.validationErrors && state.validationErrors.city}
                    >
                            {state.cities.map((city) => (
                                <MenuItem key={city.id} value={city.id}>
                                    {city.name}
                                </MenuItem>
                             ))} 
                </MapItTextField>
            </Grid>

            <Grid item md={6} xs={12} >
                  <MapItTextField
                    label={t("Specialty")}
                    name="specialty"
                    handleChange={handleChange}
                    value={state.profileDetails.specialty || []}
                    required={true}
                    select
                    SelectProps={{
                      multiple: true,
                    }}
                    error={state.validationErrors && state.validationErrors.specialty}
                    >
                            {state.specialties.map((specialty) => (
                                <MenuItem key={specialty.id} value={specialty.id}>
                                    {specialty.name}
                                </MenuItem>
                            ))}
                </MapItTextField>
            </Grid>

            <Grid item md={12} xs={12} >
                  <MapItTextField
                    label={t("Car Origin")}
                    name="carOrigin"
                    handleChange={handleCarOriginChange}
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
            <Grid item md={12} xs={12} >
                  <MapItTextField
                    label={t("Car Brand")}
                    name="carBrand"
                    handleChange={handleCarBrandChange}
                    value={state.profileDetails.carBrand || ""}
                    required={true}
                    select
                    error={state.validationErrors && state.validationErrors.carBrand}
                    >
                            {state.carBrands.map((brand) => (
                                <MenuItem key={brand.id} value={brand.id}>
                                    {brand.name}
                                </MenuItem>
                            ))}
                </MapItTextField>
            </Grid>
            <Grid item md={12} xs={12} >
                  <MapItTextField
                    label={t("Car Model")}
                    name="carModel"
                    handleChange={handleChange}
                    value={state.profileDetails.carModel || []}
                    required={true}
                    select
                    SelectProps={{
                      multiple: true,
                    }}
                    error={state.validationErrors && state.validationErrors.carModel}
                    >
                            {state.carModels.map((model) => (
                                <MenuItem key={model.id} value={model.id}>
                                    {model.name}
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

export default MerchantDetails;
