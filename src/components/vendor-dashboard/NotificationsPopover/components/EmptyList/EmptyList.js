import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing(3)
  },
  image: {
    height: 240,
    backgroundImage: 'url("/images/undraw_empty_xct9.svg")',
    backgroundPositionX: 'right',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }
}));

const EmptyList = props => {
  const { className, ...rest } = props;
  const { t } = useTranslation();

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.image} />
      <Typography variant="h4">
        {t("You have no notifications")}
      </Typography>
    </div>
  );
};

EmptyList.propTypes = {
  className: PropTypes.string
};

export default EmptyList;