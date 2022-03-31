/* eslint-disable no-undef */
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { $APP_NAME } from "src/constants";
// import { useLocation } from "react-router-dom";

// const NODE_ENV = process.env.NODE_ENV;
// const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

const Page = (props) => {
  const { title, children, ...rest } = props;

  // const location = useLocation();

  // useEffect(() => {
  //   if (NODE_ENV === "production") {
  //     return;
  //   }

  //   if (window.gtag) {
  //     window.gtag("config", GA_MEASUREMENT_ID, {
  //       page_path: location.pathname,
  //       page_name: title,
  //     });
  //   }
  // }, [title, location]);

  return (
    <div {...rest}>
      <Helmet>
        <title>
          {title} | {$APP_NAME}
        </title>
      </Helmet>
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Page;
