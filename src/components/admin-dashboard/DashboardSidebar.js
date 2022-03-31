import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
} from "@material-ui/core";
import {
  LocalShippingOutlined,
  EventNoteOutlined,
  // AssessmentOutlined,
  // LinkOutlined,
  StoreOutlined,
  PeopleAltRounded,
  // MapRounded,
} from "@material-ui/icons";
import { Settings as SettingsIcon, User as UserIcon } from "react-feather";
import Navigation from "../navigation";
import { useTranslation } from "react-i18next";

const items = [
  {
    href: "/admin/users",
    icon: PeopleAltRounded,
    title: "Users",
  },
  {
    href: "/admin/orders",
    icon: EventNoteOutlined,
    title: "Orders",
    children: [
      {
        title: "New Orders",
        href: "/admin/orders/new"
      },
      {
        title: "Delivery Orders",
        href: "/admin/orders/pending-delivery"
      },
      {
        title: "Delivered Orders",
        href: "/admin/orders/delivered"
      },
      {
        title: "Collected Orders",
        href: "/admin/orders/collected"
      },
      {
        title: "Canceled Orders",
        href: "/admin/orders/canceled"
      },
      {
        title: "Orders Follow up",
        href: "/admin/orders/follow-up"
      },
    ]
  },
  {
    href: "/admin/merchants",
    icon: PeopleAltRounded,
    title: "Merchants",
  },
  {
    href: "/admin/settings",
    icon: SettingsIcon,
    title: "Settings",
    children: [
      {
        title: "General",
        href: "/admin/settings"
      },
      {
        title: "Language",
        href: "/admin/settings/language"
      }
    ]
  },
];

const navigationConfig = [
  {
    title: 'AdminSidebar',
    pages: items,
  }
];

const DashboardSidebar = ({ onMobileClose, openMobile, admin }) => {
  const location = useLocation();
  const { t } = useTranslation();
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          py: 2,
        }}
        bgcolor="main.dark"
      >
        <Typography color="text.white" variant="subtitle1">
          {t("Welcome")}
        </Typography>
        <Typography color="text.white" variant="h1" sx={{ textAlign: 'center' }}>
          {admin.name}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {navigationConfig.map(list => (
          <Navigation
            component="div"
            key={list.title}
            pages={list.pages}
            title={list.title}
          />
        ))}
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          // anchor="start"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256,
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          // anchor="start"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: "calc(100% - 64px)",
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false,
};

export default DashboardSidebar;
