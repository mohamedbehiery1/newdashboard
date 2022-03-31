import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from "@material-ui/core";

const provinces = [
  {
    value: "riyadh",
    label: "Riyadh",
  },
  {
    value: "jeddah",
    label: "Jeddah",
  },
  {
    value: "medina",
    label: "Medina",
  },
  {
    value: "tabuk",
    label: "Tabuk",
  },
  {
    value: "mecca",
    label: "Mecca",
  },
];

const AdminProfileDetails = (props) => {
  const [values, setValues] = useState({
    firstName: "Katarina",
    organizationName: "Namshi",
    email: "namshi@mapit.sa",
    phone: "966123456789",
    province: "riyadh",
    country: "Saudi Arabia",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const { t } = useTranslation();

  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader
          // subheader="The information can be edited"
          title={t("Profile")}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid> */}
            <Grid
              item
              // md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label={t("Name")}
                name="organizationName"
                onChange={handleChange}
                required
                value={values.organizationName}
                variant="outlined"
                InputLabelProps={{
                  required: false,
                  sx: {
                    color: "text.placeholder",
                  },
                }}
                color="main"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t("Email Address")}
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
                InputLabelProps={{
                  required: false,
                  sx: {
                    color: "text.placeholder",
                  },
                }}
                color="main"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t("Phone Number")}
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phone}
                variant="outlined"
                InputLabelProps={{
                  required: false,
                  sx: {
                    color: "text.placeholder",
                  },
                }}
                color="main"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t("Country")}
                name="country"
                onChange={handleChange}
                required
                value={values.country}
                variant="outlined"
                InputLabelProps={{
                  required: false,
                  sx: {
                    color: "text.placeholder",
                  },
                }}
                color="main"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t("Select Province")}
                name="province"
                onChange={handleChange}
                required
                select
                // SelectProps={{ native: true }}
                value={values.province}
                // variant="outlined"
                InputLabelProps={{
                  required: false,
                  sx: {
                    color: "text.placeholder",
                    // fontSize: 16,
                  },
                }}
                color="main"
              >
                {provinces.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="main" variant="contained">
            {t("Save")}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AdminProfileDetails;
