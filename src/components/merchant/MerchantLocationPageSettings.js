import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import runJoiValidate from "src/__utils__/runJoiValidate";
import { LoadingButton } from "@material-ui/lab";
import { MapItTextField } from "src/components/common";
import { pick, split, last, omit, startsWith } from 'lodash';
// import parsePhoneNumber from 'libphonenumber-js';
import { MerchantLogo } from "src/components/merchant";
import { locationPageSettingsValidationSchema } from './ValidationSchemas';

const MerchantLocationPageSettings = ({
  settings,
  handleSubmit,
  pendingSubmit,
  error,
  success,
  ...props
}) => {

  const { t } = useTranslation();

  const [state, setState] = useState({});

  useEffect(() => {
    if (state.locationPageLogo && startsWith(state.locationPageLogo, "data")) return
    if (state.locationPageColor && state.locationPageColor !== settings.locationPageColor) return
    setState({
      ...state,
      ...settings,
    })
  }, [settings])

  const handleChange = (event) => {
    // File Chosen
    if (event.target.name === "file") {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.addEventListener("load", function () {
        const base64String = reader.result
        handleChange({
          target: {
            name: "locationPageLogo",
            value: base64String
          }
        })
      }, false);
      return reader.readAsDataURL(file);
    }
    // Event
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let settings = pick(state, ['locationPageColor', 'locationPageLogo'])
    // Validate
    const validationErrors = runJoiValidate(locationPageSettingsValidationSchema, settings);
    setState({
      ...state,
      validationErrors
    });
    if (validationErrors) return;
    // Process
    if (startsWith(settings.locationPageLogo, "data")) {
      settings.locationPageLogo = last(split(settings.locationPageLogo, ","))
    } else {
      settings = omit(settings, ["locationPageLogo"])
    }
    handleSubmit(settings);
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader
          title={t("Location Page Settings")}>
        </CardHeader>
        <Divider />
        <CardContent>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} sm={6} md={6} >
              <MerchantLogo
                variant="square"
                imgProps={{ style: { "objectFit": "contain" } }}
                logo={state.locationPageLogo}
                handleChange={handleChange}
                error={state.validationErrors && state.validationErrors.locationPageLogo}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <MapItTextField
                label={t("Color")}
                name="locationPageColor"
                value={state.locationPageColor || ""}
                required={true}
                handleChange={handleChange}
                type="color"
                error={state.validationErrors && state.validationErrors.locationPageColor}
              />
            </Grid>
          </Grid>
          <Typography mt={1}>
            {t("*Logo dimensions 256*256")}
          </Typography>
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
            disabled={state.submitDisabled}
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

export default MerchantLocationPageSettings;
