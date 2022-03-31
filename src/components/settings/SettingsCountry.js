import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Grid,
  MenuItem,
} from "@material-ui/core";


const countries = [
    {
      value: "61e888a4f7274d001692753e",
      label: "Kuwait",
    },
    {
      value: "61e888eef7274d0016927540",
      label: "UAE",
    },
  ];

const SettingsCountry = (props) => {
  const [values, setValues] = useState({
    country: localStorage.getItem("country") || "61e888a4f7274d001692753e",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const { t, i18n } = useTranslation();

  const store = useStore();

  const handleClick = () => {
    localStorage.setItem("country",values.country)
  };

  return (
    <form {...props}>
      <Card>
        <CardHeader subheader={t("Choose Country")} title={t("Country")} />
        <Divider />
        <CardContent>
          <Grid item xs={8} md={4} >
            <TextField
              fullWidth
              name="country"
              onChange={handleChange}
              required
              select
              // SelectProps={{ native: true }}
              value={values.country}
              variant="outlined"
              InputLabelProps={{
                required: false,
                sx: {
                  color: "text.placeholder",
                },
              }}
              color="main"
            >
              {countries.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.label)}
                </MenuItem>
              ))}
            </TextField>
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
          <Button color="main" variant="contained" onClick={handleClick}>
            {t("Update")}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default SettingsCountry;
