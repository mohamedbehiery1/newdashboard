// import { useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import Logo from "../Logo";
import AuthService from "src/__services__/AuthService";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MobileNavbar = ({ bgColor, logoType, isDriver, ...props }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logOut = () => {
    AuthService.logout();
    navigate("/auth/driver", { replace: true });
  }

  return (
    <AppBar color={bgColor} elevation={0} {...props}>
      <Toolbar style={{ justifyContent: isDriver ? 'space-between' : 'center' }}>
        <Logo type={logoType} />
        {
          isDriver &&
          <Button
            onClick={logOut}
            disableRipple
            color="white"
            sx={{ textTransform: "none" }}
          >
            {t("Log Out")}
          </Button>
        }
      </Toolbar>
    </AppBar>
  );
};

MobileNavbar.propTypes = {
  // onMobileNavOpen: PropTypes.func,
  bgColor: PropTypes.string,
  logoType: PropTypes.string,
  isDriver: PropTypes.bool
};

MobileNavbar.defaultProps = {
  bgColor: 'main',
};

export default MobileNavbar;
