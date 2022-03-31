import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Popover,
  CardHeader,
  CardActions,
  Divider,
  Button,
  colors
} from '@material-ui/core';

import { NotificationList, EmptyList } from './components';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    width: 350,
    maxWidth: '100%'
  },
  actions: {
    backgroundColor: colors.grey[50],
    justifyContent: 'center'
  }
}));

const NotificationsPopover = props => {

  const { notifications, anchorEl, onClick, ...rest } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Popover
      {...rest}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
      sx={{ maxHeight: '80%' }}
    // marginThreshold={0}
    >
      <div className={classes.root}>
        <CardHeader title={t("Notifications")} />
        <Divider />
        {notifications.length > 0 ? (
          <NotificationList notifications={notifications} onClick={onClick} />
        ) : (
          <EmptyList />
        )}
        <Divider />
        {/* <CardActions className={classes.actions}>
          <Button
            component={RouterLink}
            size="small"
            to="#"
          >
            See all
          </Button>
        </CardActions> */}
      </div>
    </Popover>
  );
};

NotificationsPopover.propTypes = {
  anchorEl: PropTypes.any,
  className: PropTypes.string,
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default NotificationsPopover;
