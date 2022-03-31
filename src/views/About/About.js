import React from "react";
import { Typography, Container } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { $APP_NAME } from "src/constants";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | {$APP_NAME}</title>
      </Helmet>
      <Container sx={{ height: "100%", width: "100%", py: 3 }}>
        <Typography m={2} component="h1" variant="h2">
          About {$APP_NAME}
        </Typography>
        <Typography m={2} component="h1" variant="h4">
          What is Lorem Ipsum?
        </Typography>
        <Typography m={2} variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Typography>
      </Container>
    </>
  );
};

export default About;
