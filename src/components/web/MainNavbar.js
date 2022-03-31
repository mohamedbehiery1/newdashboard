// import { useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar } from "@material-ui/core";
import { Logo } from "src/components";

const MainNavbar = (props) => {
  return (
    <AppBar color="main" elevation={0} {...props}>
      <Toolbar>
        <Logo type="light" />
      </Toolbar>
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
};

export default MainNavbar;
