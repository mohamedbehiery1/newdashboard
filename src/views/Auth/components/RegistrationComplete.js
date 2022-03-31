import React from "react";
import {
    Link,
    Box,
    Typography,
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    button: {
        '&:hover': {
            backgroundColor: '#00588C',
        },
    }
}));

const RegistrationComplete = ({ ...props }) => {
    
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 1,
                    mb: 2
                }}
            >
                <Typography my={7} variant="h2" color='success.main'>
                    {t("Registration successful. You can login to your dashboard") + " "}
                    <Link href="/auth/merchant" color="inherit">
                        {t("here")}
                    </Link>
                </Typography>
            </Box>
            <Button
                component={RouterLink}
                to='/'
                display="block"
                disableElevation
                variant="contained"
                color="yellow"
                className={classes.button}
                sx={{
                    mt: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: 20,
                    p: 0.2,
                    px: 2
                }}
            >
                {t("Back to home")}
            </Button>
        </>
    );
};

export default RegistrationComplete;
