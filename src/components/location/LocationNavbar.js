// import { useState } from "react";
import PropTypes from "prop-types";
// import { AppBar, Toolbar, Button } from "@material-ui/core";
// import Logo from "../Logo";
import AuthService from "src/__services__/AuthService";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LocationNavbar = ({ bgColor, logoType, isDriver, ...props }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logOut = () => {
    AuthService.logout();
    navigate("/auth/driver", { replace: true });
  }

  return (
    <></>
  );
};

LocationNavbar.propTypes = {
  // onLocationNavOpen: PropTypes.func,
  bgColor: PropTypes.string,
  logoType: PropTypes.string,
  isDriver: PropTypes.bool
};

LocationNavbar.defaultProps = {
  bgColor: 'main',
};

export default LocationNavbar;
