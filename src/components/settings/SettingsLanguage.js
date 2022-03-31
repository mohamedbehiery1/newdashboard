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

const languages = [
  {
    value: "ar-SA",
    label: "Arabic",
  },
  {
    value: "en-US",
    label: "English",
  },
];

const SettingsLanguage = (props) => {
  const [values, setValues] = useState({
    language: localStorage.getItem("i18nextLng") || "en-US",
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
    i18n.changeLanguage(values.language);
  };

  return (
    <form {...props}>
      <Card>
        <CardHeader subheader={t("Choose Language")} title={t("Language")} />
        <Divider />
        <CardContent>
          <Grid item xs={8} md={4} >
            <TextField
              fullWidth
              name="language"
              onChange={handleChange}
              required
              select
              // SelectProps={{ native: true }}
              value={values.language}
              variant="outlined"
              InputLabelProps={{
                required: false,
                sx: {
                  color: "text.placeholder",
                },
              }}
              color="main"
            >
              {languages.map((option) => (
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

export default SettingsLanguage;
