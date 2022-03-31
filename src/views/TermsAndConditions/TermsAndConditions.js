import React, { useEffect, useState } from "react";
import { Typography, Container } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { $APP_NAME } from "src/constants";
import HttpService from 'src/__services__/httpService';
import { pick } from 'lodash';
import { useTranslation } from 'react-i18next';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const TermsAndConditions = () => {

  const { t, i18n } = useTranslation();
  const [state, setState] = useState({});

  const getTerms = async _ => {
    try {
      const response = await HttpService.get(`${apiUrl}/v1/website/home`);
      const { settings } = response.data.body
      const terms = pick(settings,
        [
          "terms_conditions_ar",
          "terms_conditions_en",
        ]
      )
      setState(terms)
    } catch (e) {
      console.log(e)
      if (e.response)
        console.log(e.response)
    }
  }

  useEffect(() => {
    getTerms()
  }, [])

  return (
    <>
      <Helmet>
        <title>Terms and Conditions | {$APP_NAME}</title>
      </Helmet>
      <Container sx={{ height: "100%", width: "100%", py: 3 }}>
        <Typography m={2} component="h1" variant="h2">
          {t("Terms and Conditions")}
        </Typography>
        <Typography m={2} variant="body1">
          {i18n.dir() === "rtl" ? state.terms_conditions_ar : state.terms_conditions_en}
        </Typography>
      </Container>
    </>
  );
};

export default TermsAndConditions;
