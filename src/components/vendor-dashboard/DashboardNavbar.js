import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar,
  Button,
  Box,
  Hidden,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import BusinessIcon from '@material-ui/icons/Business';
import Logo from "src/components/Logo";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import AuthService from "src/__services__/AuthService";
import generateCloudinaryLink from 'src/__utils__/generateCloudinaryLink';
import DashboardNotifications from "./DashboardNotifications";

const DashboardNavbar = ({ onMobileNavOpen, merchant, ...rest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const logOut = () => {
    AuthService.logout();
    navigate("/auth/merchant", { replace: true });
  }

  return (
    <AppBar color="main" elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/">
          <Logo
            type="light"
            style={{
              marginInlineStart: "4vw" /*128 - 16 - 36 - 10*/,
            }}
          />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          <DashboardNotifications/>
          <Button
            onClick={logOut}
            disableRipple
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            {t("Log Out")}
          </Button>
          <Avatar
            component={RouterLink}
            src={generateCloudinaryLink(merchant.logo)}
            sx={{
              cursor: "pointer",
              width: 42,
              height: 42,
            }}
            to="/merchant/account"
          >
            <BusinessIcon/>
          </Avatar>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
};

export default DashboardNavbar;
