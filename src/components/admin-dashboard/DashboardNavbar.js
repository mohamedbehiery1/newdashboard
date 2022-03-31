import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Button,
  Box,
  Hidden,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Logo from "../Logo";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import AuthService from "src/__services__/AuthService";

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const logOut = () => {
    AuthService.logout();
    navigate("/auth/admin", { replace: true });
  }

  return (
    <AppBar color="main" elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/admin/settings">
          <Logo
            type="light"
            style={{
              marginInlineStart: "4vw"
            }}
          />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          <Button
            onClick={logOut}
            disableRipple
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            {t("Log Out")}
          </Button>
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
