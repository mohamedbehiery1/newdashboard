import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  button: {
    backgroundColor: 'transparent !important',
    color: "#00588C !important",
    '&:hover': {
      backgroundColor: 'transparent !important',
      color: '#FAB707 !important',
    },
  }
})

const FooterNav = ({
  className,
  ...props
}) => {

  const { t } = useTranslation();
  const muiClasses = useStyles()

  const classes = classNames(
    // 'footer-nav',
    className
  );

  return (
    <nav
      {...props}
      className={classes}
    >
      <ButtonGroup sx={{ alignItems: 'center', /*flex: 1, justifyContent: 'center',*/ }} variant="standard">
        <Button disableTouchRipple className={muiClasses.button} component={Link} to='/terms-and-conditions' py={0}>
          {t("Terms and Conditions")}
        </Button>
        <Button disableTouchRipple className={muiClasses.button} component={Link} to='/privacy-policy' py={0}>
          {t("Privacy Policy")}
        </Button>
        <Button disableTouchRipple className={muiClasses.button} component={Link} to='/documentation' py={0}>
          {t("Documentation")}
        </Button>
      </ButtonGroup>
    </nav>
  );
}

export default FooterNav;