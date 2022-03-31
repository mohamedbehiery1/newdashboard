import React, { useEffect, useState } from "react";
import { Typography, Container, Link, Box, Card, Grid } from "@material-ui/core";
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

const ParamView = ({ paramName, paramDescription }) => (
  <Grid container my={1} >
    <Grid item xs={2}>
      <APITypography variant="h6">
        {paramName}
      </APITypography>
    </Grid>
    <Grid item xs={10}>
      <APITypography variant="body1">
        {paramDescription}
      </APITypography>
    </Grid>
  </Grid>
)

const Documentation = () => {

  const { t, i18n } = useTranslation();

  const apis = {
    pinLocation: {
      headers: [
        { name: "Authorization", description: '"Bearer <TOKEN>"' }
      ],
      params: [
        {
          name: "lang",
          description: 'String(required). The language that you want to present the set location page to the user, ("ar-SA" or "en-US")'
        },
        {
          name: "callback_url",
          description: 'String(required). URL that we will return to it in your website after submitting the form'
        }
      ]
    },
    createOrder: {
      headers: [
        { name: "Authorization", description: '"Bearer <TOKEN>"' }
      ],
      params: [
        {
          name: "orderItems",
          description: 'Array(required). Array of order items: {`{ item: String, amount: Number }`}.'
        },
        {
          name: "user",
          description: 'Object(required). User details: { name: String, phoneCode: String, phone: String } e.g. {"name" : "Mohamed", "phone": "54 555 5555", "phoneCode": "+966" }'
        },
        {
          name: "packagesCount",
          description: 'Number(required). The number of packages.'
        },
        {
          name: "addressId",
          description: 'String(optional). The address id provided as query string via Pin Location page callback.'
        },
        {
          name: "amountPayable",
          description: 'Number(optional). amount required for payment if exists.'
        },
        {
          name: "area",
          description: 'String(optional). The area component of delivery address.'
        },
        {
          name: "city",
          description: 'String(optional). The city component of delivery address.'
        },
        {
          name: "street",
          description: 'String(optional). The street component of delivery address.'
        }
      ]
    }
  }

  useEffect(() => {
    i18n.changeLanguage("en-US")
  }, [])

  return (
    <>
      <Helmet>
        <title>Documentation | {$APP_NAME}</title>
      </Helmet>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <APITypography my={2} variant="h1">
          {t("API Documentation")}
        </APITypography>
        <APITypography>
          {`Welcome to MapIt documentation. In order to use our service you need to have a MapIt merchant account. You can sign up from `}
          <Link href="https://www.mapitsa.com/auth/merchant/register" color="inherit">
            here
          </Link>
        </APITypography>
        <APITypography>
          You can get your authorization bearer token from your dashboard account (Account -> API Key)
        </APITypography>
        <APITypography variant="h3" mt={2} >
          Get URL of Pin Location page
        </APITypography>
        <Card sx={{ px: 2, py: 1, my: 1, backgroundColor: "rgb(230 230 230)" }}>
          <APITypography mb={-1} variant="h6" color="text.orange">
            POST
          </APITypography>
          <APITypography>
            {`${apiUrl}/v1/merchant/location-url`}
          </APITypography>
        </Card>
        <APITypography>
          This api returns the url used to get user location
        </APITypography>
        <APITypography mt={2} variant="h5">
          Headers
        </APITypography>
        {
          apis.pinLocation.headers.map(
            header => <ParamView paramName={header.name} paramDescription={header.description} />
          )
        }
        <APITypography mt={2} variant="h5">
          Params
        </APITypography>
        {
          apis.pinLocation.params.map(
            param => <ParamView paramName={param.name} paramDescription={param.description} />
          )
        }
        <APITypography mt={2}>
          The user will return to your callback url with "addressId" as a query string that you will send to us in the next API to create the order.
          This step is optional you can skip it and send "addressId" in create order API with null.
          If you skip this step we will send sms to the user after create order API containing URL to set his location.
        </APITypography>
        <APITypography variant="h3" mt={2} >
          Create Order
        </APITypography>
        <Card sx={{ px: 2, py: 1, my: 1, backgroundColor: "rgb(230 230 230)" }}>
          <APITypography mb={-1} variant="h6" color="text.orange">
            POST
          </APITypography>
          <APITypography>
            {`${apiUrl}/v1/merchant/order`}
          </APITypography>
        </Card>
        <APITypography>
          This api returns the url used to get user location.
        </APITypography>
        <APITypography mt={2} variant="h5">
          Headers
        </APITypography>
        {
          apis.createOrder.headers.map(
            header => <ParamView paramName={header.name} paramDescription={header.description} />
          )
        }
        <APITypography mt={2} variant="h5">
          Params
        </APITypography>
        {
          apis.createOrder.params.map(
            param => <ParamView paramName={param.name} paramDescription={param.description} />
          )
        }
        <Box height={'80px'} />
      </Container>
    </>
  );
};

export default Documentation;
