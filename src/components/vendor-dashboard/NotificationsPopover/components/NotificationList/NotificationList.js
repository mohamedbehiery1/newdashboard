import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from "moment";
import 'moment/locale/ar';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PaymentIcon from '@material-ui/icons/Payment';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import CodeIcon from '@material-ui/icons/Code';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import StoreIcon from '@material-ui/icons/Store';
import gradients from 'src/__utils__/gradients';
import { useTranslation } from 'react-i18next';
import { startsWith } from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {},
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.background.default
    },
    cursor: "pointer"
  },
  avatarBlue: {
    backgroundImage: gradients.blue
  },
  avatarGreen: {
    backgroundImage: gradients.green
  },
  avatarOrange: {
    backgroundImage: gradients.orange
  },
  avatarIndigo: {
    backgroundImage: gradients.indigo
  },
  avatarBrandBlue: {
    backgroundImage: gradients.brandBlue
  },
  arrowForwardIcon: {
    color: theme.palette.icon
  }
}));

const NotificationList = props => {

  const { i18n } = useTranslation();
  const { notifications, className, onClick, ...rest } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const classes = useStyles();

  const avatars = {
    order: (
      <Avatar className={classes.avatarBlue}>
        <PaymentIcon />
      </Avatar>
    ),
    user: (
      <Avatar className={classes.avatarOrange}>
        <PeopleIcon />
      </Avatar>
    ),
    project: (
      <Avatar className={classes.avatarGreen}>
        <StoreIcon />
      </Avatar>
    ),
    feature: (
      <Avatar className={classes.avatarIndigo}>
        <CodeIcon />
      </Avatar>
    ),
    location: (
      <Avatar className={classes.avatarBrandBlue}>
        <LocationOnIcon />
      </Avatar>
    )
  };

  const handleNotificationClick = notification => {
    onClick(notification.id)
    const { pathname } = location;
    const { orderId, id } = notification;
    if (!startsWith(pathname, `/merchant/orders/${orderId}`)) {
      // navigate to other order page
      navigate(`/merchant/orders/${orderId}?notification=${id}`, { replace: true });
      window.location.reload()
    }
  }

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
      disablePadding
    >
      {notifications.map((notification, i) => (
        <ListItem
          className={classes.listItem}
          divider={i < notifications.length - 1}
          key={notification.id}
          sx={{
            bgcolor: notification.opened ? "#FFFFFF" : "#e9f3fe",
            "&:hover": {
              bgcolor: "#f0f2f5"
            },
          }}
          onClick={_ => handleNotificationClick(notification)}
        >
          <ListItemAvatar>{avatars[notification.type]}</ListItemAvatar>
          <ListItemText
            primary={notification.title}
            primaryTypographyProps={{ variant: 'body2', sx: { color: "text.primary" } }}
            secondary={moment(notification.created_at).fromNow()}
          />
          <ArrowForwardIcon
            className={classes.arrowForwardIcon}
            sx={{ transform: i18n.dir() === 'rtl' ? 'scale(-1, 1)' : '', color: "text.primary" }}
          />
        </ListItem>
      ))}
    </List>
  );
};

NotificationList.propTypes = {
  className: PropTypes.string,
  notifications: PropTypes.array.isRequired
};

export default NotificationList;
