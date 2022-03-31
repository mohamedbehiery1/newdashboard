import React from "react";
import {
    Typography,
} from "@material-ui/core";
import { $APP_NAME } from "src/constants";

const Copyright = ({ title }) => {
    return (
        <Typography variant="body1" sx={{ color: "#FFFFFF" }} align="center">
            {`${title} ${$APP_NAME} ${new Date().getFullYear()}`}
        </Typography>
    );
};

export default Copyright;