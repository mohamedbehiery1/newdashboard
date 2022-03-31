import React, { useEffect, useState } from "react";
import { Typography, Button, Link, Box, Card, Grid, useMediaQuery } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { $APP_NAME } from "src/constants";
import HttpService from 'src/__services__/httpService';
import { pick } from 'lodash';
import { useTranslation } from 'react-i18next';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const APITypography = props => {
  const { i18n } = useTranslation();

  return (
    <Typography align={i18n.dir() === "rtl" ? "end" : "start"} {...props}>
      {props.children}
    </Typography>
  )
}

const Pricing = () => {

  const { t, i18n } = useTranslation();

  const matchesXS = useMediaQuery(theme => theme.breakpoints.up('xs'));
  const matchesMD = useMediaQuery(theme => theme.breakpoints.up('md'));

  const sizeForMediaQuery = refSize => {
    let size = refSize;
    if (matchesMD) size = refSize * 1;
    else if (matchesXS) size = refSize * (i18n.dir() === "rtl" ? 1.4 : 1.8);
    return `${size}vw`;
  }

  return (
    <>
      <Helmet>
        <title>Pricing | {$APP_NAME}</title>
      </Helmet>
      <Box sx={{ bgcolor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: 'center' }} >
        <Box>
          <Typography color="text.primary" textAlign="center" fontSize={sizeForMediaQuery(i18n.dir() === 'rtl' ? 2.625 : 3)} lineHeight={i18n.dir() === 'rtl' ? '1.4' : '1.2'} sx={{ mb: 2 }}>
            {t("Simple, transparent pricing")}<br />
          </Typography>
          <Typography color="text.secondary" textAlign="center" fontSize={sizeForMediaQuery(i18n.dir() === 'rtl' ? 1.3125 : 1.5)} lineHeight={i18n.dir() === 'rtl' ? '1.4' : '1.2'} sx={{ mb: 2 }}>
            {t("Unlimited users, unlimited drivers. Just pick your features and love logistics again.")}
          </Typography>
          <Typography color="text.secondary" textAlign="center" fontSize={sizeForMediaQuery(i18n.dir() === 'rtl' ? 1.3125 : 1.5)} lineHeight={i18n.dir() === 'rtl' ? '1.4' : '1.2'}>
            {t("All plans include a 14-day free trial.")}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            // component={Link}
            // to='/auth/plans'
            // onClick={handleFreeTrialClick}
            color="yellow"
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: 20,
              mx: 2,
              minWidth: '160px'
            }}
          >
            {t("Free Trial")}
          </Button>
          <Button
            // component={Link}
            // to='/contact-us'
            color="yellow"
            variant="contained"
            sx={{ textTransform: "none", fontSize: 20, mx: 2, minWidth: '160px' }}
          >
            {t("Contact sales")}
          </Button>
        </Box>
      </Box>
      <Box sx={{ my: 4, bgcolor: "#FFFFFF", p: '2px', mx: '-4px' }}>
        <Grid container alignItems='center' >
          <Grid item xs={12} sm={6} md={3.6} sx={{ p: '2px' }}>
            <Box sx={{ height: 130, bgcolor: "#f0cd4b" }}>
              Plan 1
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4} sx={{ p: '2px' }}>
            <Box sx={{ height: 130, bgcolor: "#78d5df" }}>
              Plan 1
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4} sx={{ p: '2px' }}>
            <Box sx={{ height: 130, bgcolor: "#75b5fa" }}>
              Plan 1
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3.6} sx={{ p: '2px' }}>
            <Box sx={{ height: 130, bgcolor: "#b394f0" }}>
              Plan 1
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Pricing;
