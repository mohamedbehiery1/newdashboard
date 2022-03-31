import React, { useState, useEffect } from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
// import Testimonial from '../components/sections/Testimonial';
import Cta from '../components/sections/Cta';
import Footer from '../components/layout/Footer';
import HttpService from 'src/__services__/httpService';
import { pick } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { $APP_NAME } from 'src/constants';

// Styles
import '../assets/scss/style.scss';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const Landing = () => {

  const [state, setState] = useState({});

  const getHomeData = async _ => {
    try {
      const response = await HttpService.get(`${apiUrl}/v1/website/home`);
      const { body: homeData } = response.data
      setState(homeData)
    } catch (e) {
      console.log(e)
      if (e.response)
        console.log(e.response)
    }
  }

  useEffect(() => {
    getHomeData()
  }, [])

  return (
    <>
      <Helmet>
        <title>{$APP_NAME}</title>
      </Helmet>
      <Hero freeTrialDays={state.settings && state.settings.freeTrialDays} className="illustration-section-01" />
      {/* <div id="features" style={{ height: 84 }} /> */}
      <FeaturesSplit invertMobile imageFill className="illustration-section-02" />
      <div id="features" style={{ height: 90 }} />
      <FeaturesTiles />
      {/* <Testimonial topDivider /> */}
      <Cta split />
      <Footer
        socialLinks={
          pick(
            state.settings,
            [
              "facebook",
              "instagram",
              "linkedin",
              "snapchat",
              "twitter",
              "youtube",
            ]
          )
        }
      />
    </>
  );
}

export default Landing;