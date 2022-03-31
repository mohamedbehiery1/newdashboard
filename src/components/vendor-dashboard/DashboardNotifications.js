import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Badge,
} from '@material-ui/core';
import { useTranslation } from "react-i18next";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsPopover from './NotificationsPopover';
import NotificationsService from 'src/__services__/NotificationsService';
import { countBy, find, map, set } from 'lodash';

const notifExample = {
  "read": true,
  "body_en": "The location for the order number 1025 has been picked successfully",
  "body_ar": "الموقع للطلب رقم 1025تم تحديثه",
  "order": "61c2ecadc34ddd3d7198ac4d",
  "receiver": "61b240d366ec6e036de73657",
  "notificationTo": "MERCHANT",
  "createdAt": "2021-12-22T09:38:38.059Z",
  "updatedAt": "2021-12-22T11:33:36.934Z",
  "id": "61c2f21e4b745a3e195101c8"
}

const DashboardNotifications = () => {

  const { t, i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await NotificationsService.getNotifications(1);
      const { docs: notifications } = response.data.body.notifications;
      //properties: "read", "body_en", "body_ar", "order", "receiver", "notificationTo", "createdAt", "updatedAt", "id"
      const mappedNotifications = map(
        notifications,
        notif => ({
          id: notif.id,
          type: "location",
          opened: notif.read,
          title: i18n.dir() === "rtl" ? notif.body_ar : notif.body_en,
          created_at: notif.createdAt,
          orderId: notif.order
        })
      )
      setNotifications(mappedNotifications)
    } catch (e) {
      console.log(e)
      console.log(e.response)
    }
  }

  useEffect(fetchNotifications, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (id) => {
    setAnchorEl(null);
    setTimeout(fetchNotifications, 500);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton
        disableRipple
        // variant="contained"
        color="inherit"
        sx={{ textTransform: "none" }}
        aria-describedby={id}
        onClick={handleClick}
      >
        <Badge
          badgeContent={countBy(notifications, notif => notif.opened === false).true}
          color="danger"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationsPopover
        open={open}
        anchorEl={anchorEl}
        notifications={notifications}
        onClose={handleClose}
        onClick={handleNotificationClick}
      />
      {/* <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
          <List>
            {
              [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17].map(e => {
                return <Typography key={e} sx={{ p: 2 }}>The content of the Popover sdfsdfsdf sdfsd fs df sd fs f sd fs df sdf sd fds </Typography>
              })
            }
          </List>
        </Paper>
      </Popover> */}
    </div>
  );
}

export default DashboardNotifications;