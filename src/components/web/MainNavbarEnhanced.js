import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Logo } from "src/components";
import { useTranslation } from 'react-i18next';
import { AppBar, Button, ButtonGroup, Box, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    button: {
        backgroundColor: 'transparent !important',
        color: 'white !important',
        '&:hover': {
            backgroundColor: 'transparent !important',
            color: '#FAB707 !important',
        },
    }
})

const MainNavbarEnhanced = ({
    className,
    navPosition,
    hideNav,
    hideSignin,
    bottomOuterDivider,
    bottomDivider,
    ...props
}) => {

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const muiClasses = useStyles()
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleLanguageClick = _ => {
        if (!isCollapsed) collapseMenu();
        const language = i18n.language
        const languageToSet = language === 'ar-SA' ? 'en-US' : 'ar-SA'
        i18n.changeLanguage(languageToSet);
    };

    const collapseMenu = _ => setIsCollapsed(true);
    const expandMenu = _ => setIsCollapsed(false);

    const classes = classNames(
        'site-header',
        // 'has-shadow',
        bottomOuterDivider && 'has-bottom-divider',
        className
    );

    const Navigation = (orientation, handleClick) => (
        <>
            <ButtonGroup {...orientation} sx={{ alignItems: 'center', flex: 1, justifyContent: 'center', }} variant="standard" >
                <Button onClick={_ => { if (!isCollapsed) collapseMenu() }} disableTouchRipple className={muiClasses.button} sx={{ color: 'white.main' }} href='/#features' py={0}>
                    {t("Features")}
                </Button>
                <Button onClick={_ => { if (!isCollapsed) collapseMenu() }} disableTouchRipple className={muiClasses.button} sx={{ color: 'white.main' }} component={Link} to='/pricing' py={0}>
                    {t("Pricing")}
                </Button>
                <Button onClick={_ => { if (!isCollapsed) collapseMenu() }} disableTouchRipple className={muiClasses.button} sx={{ color: 'white.main' }} component={Link} to='/contact-us' py={0}>
                    {t("Contact Us")}
                </Button>
            </ButtonGroup>
            <ButtonGroup {...orientation} sx={{ alignItems: 'center' }} variant="standard" >
                {!hideSignin &&
                    <Button onClick={_ => { if (!isCollapsed) collapseMenu() }} disableTouchRipple className={muiClasses.button} sx={{ color: 'white.main' }} component={Link} to='/auth/merchant' py={0}>
                        {t("Log In")}
                    </Button>
                }
                <Button disableTouchRipple py={0} sx={{ color: 'orange.main', marginInlineStart: orientation === "horizontal" ? 'auto' : '0px' }} onClick={handleLanguageClick}>
                    {t("ع")}
                </Button>
            </ButtonGroup>
        </>
    )

    return (
        <AppBar
            color="main"
            elevation={0}
            className={classes}
            style={{ boxShadow: '0 0.5px 24px rgb(0 89 140 / 100%)' }}
            {...props}
        >
            <Box
                className="container"
                style={{
                    width: "80%",
                    padding: 0,
                    height: '80px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }} >
                <Logo type='light' height={50} style={{ cursor: "pointer" }} onClick={_ => navigate("/", { replace: true })} />
                <Hidden mdDown>
                    <Navigation orientation="horizontal" />
                </Hidden>
                <Hidden mdUp>
                    <IconButton disableTouchRipple className={muiClasses.button} onClick={isCollapsed ? expandMenu : collapseMenu} >
                        <MenuIcon />
                    </IconButton>
                </Hidden>
                <Hidden mdUp>
                    <Box sx={{
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        top: '80px',
                        backgroundColor: '#00588C',
                        boxShadow: '0 12px 24px rgb(0 89 140 / 100%)',
                        width: '100%',
                        left: '0px',
                        right: '0px',
                        overflow: 'hidden',
                        height: isCollapsed ? '0px' : '300px',
                        borderBottomColor: '#FAB707',
                        borderBottomStyle: 'solid',
                        borderBottomWidth: isCollapsed ? '0px' : '1px',
                        transition: '0.1s 0.25s ease-in',
                    }}
                    >
                        <Navigation orientation="vertical" />
                    </Box>
                </Hidden>
            </Box>
        </AppBar>
    );
}

MainNavbarEnhanced.propTypes = {
    navPosition: PropTypes.string,
    hideNav: PropTypes.bool,
    hideSignin: PropTypes.bool,
    bottomOuterDivider: PropTypes.bool,
    bottomDivider: PropTypes.bool
};

MainNavbarEnhanced.defaultProps = {
    navPosition: '',
    hideNav: false,
    hideSignin: false,
    bottomOuterDivider: false,
    bottomDivider: false
};

export default MainNavbarEnhanced;
