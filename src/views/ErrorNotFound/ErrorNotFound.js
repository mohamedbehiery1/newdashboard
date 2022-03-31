import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, useTheme, useMediaQuery } from "@material-ui/core";
import { Page } from "src/components";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    // paddingTop: "10vh",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
  },
  imageContainer: {
    marginTop: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    width: 560,
    maxHeight: 300,
    height: "auto",
  },
  buttonContainer: {
    marginTop: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
  },
}));

const ErrorNotFound = () => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  return (
    <Page className={classes.root} title="Not Found">
      <Typography align="center" variant={mobileDevice ? "h4" : "h1"}>
        {t("Error:404 - Not Found")}
      </Typography>
      <Typography align="center" variant="body2">
        {t("Error:Page not found!")}
      </Typography>
      <div className={classes.imageContainer}>
        <img
          alt="Under development"
          className={classes.image}
          src="/static/images/undraw_page_not_found_su7k.svg"
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          component={RouterLink}
          to="/"
          sx={{ textTransform: "none" }}
          color="main"
          variant="outlined"
        >
          {t("Back to home")}
        </Button>
      </div>
    </Page>
  );
};

export default ErrorNotFound;
