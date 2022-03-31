// import { useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar } from "@material-ui/core";
import { Logo } from "src/components";

const TestNavbar = (props) => {
    return (
        <AppBar color="primary" elevation={0} {...props}>
            <Toolbar>
                <Logo type='light' style={{ margin: "auto" }} />
            </Toolbar>
        </AppBar>
    );
};

TestNavbar.propTypes = {
    onMobileNavOpen: PropTypes.func,
};

export default TestNavbar;
