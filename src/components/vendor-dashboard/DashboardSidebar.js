import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Link,
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
} from "@material-ui/core";
import { Settings as SettingsIcon, User as UserIcon } from "react-feather";
import BusinessIcon from '@material-ui/icons/Business';
import {
  LocalShippingOutlined,
  EventNoteOutlined,
  LinkOutlined,
  StoreOutlined,
  MapRounded
} from "@material-ui/icons";
import Navigation from "../navigation";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import generateCloudinaryLink from 'src/__utils__/generateCloudinaryLink';
import AuthService from "src/__services__/AuthService";
import HttpService from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const items = [
  // {
  //   href: "/merchant/statistics",
  //   icon: AssessmentOutlined,
  //   title: "Statistics",
  // },
  {
    href: "/merchant/orders",
    icon: EventNoteOutlined,
    title: "Orders",
    children: [
      {
        title: "newOrders",
        href: "/merchant/orders/new"
      },
      {
        title: "inTransitOrders",
        href: "/merchant/orders/being-delivered"
      },
      {
        title: "completedOrders",
        href: "/merchant/orders/completed"
      },
      {
        title: "failedOrders",
        href: "/merchant/orders/failed"
      },
    ]
  },
  {
    href: "/merchant/drivers",
    icon: LocalShippingOutlined,
    title: "Drivers",
  },
  {
    href: "/merchant/integrations",
    icon: LinkOutlined,
    title: "Integrations",
  },
  {
    href: "/merchant/zones",
    icon: MapRounded,
    title: "Zones",
  },
  {
    href: "/merchant/account",
    icon: UserIcon,
    title: "Account",
  },
  {
    href: "/merchant/settings",
    icon: SettingsIcon,
    title: "Settings",
    children: [
      {
        title: "Whatsapp Msgs",
        href: "/merchant/settings/whatsapp"
      },
      {
        title: "Language",
        href: "/merchant/settings/language"
      }
    ]
  },
];

const itemsForShippingCompanies = [
  // {
  //   href: "/merchant/statistics",
  //   icon: AssessmentOutlined,
  //   title: "Statistics",
  // },
  {
    href: "/merchant/orders",
    icon: EventNoteOutlined,
    title: "Orders",
    children: [
      {
        title: "newOrders",
        href: "/merchant/orders/new"
      },
      {
        title: "inTransitOrders",
        href: "/merchant/orders/being-delivered"
      },
      {
        title: "completedOrders",
        href: "/merchant/orders/completed"
      },
      {
        title: "failedOrders",
        href: "/merchant/orders/failed"
      },
    ]
  },
  {
    href: "/merchant/drivers",
    icon: LocalShippingOutlined,
    title: "Drivers",
  },
  {
    href: "/merchant/submerchants",
    icon: StoreOutlined,
    title: "Merchants",
  },
  {
    href: "/merchant/zones",
    icon: MapRounded,
    title: "Zones",
  },
  {
    href: "/merchant/account",
    icon: UserIcon,
    title: "Account",
  },
  {
    href: "/merchant/settings",
    icon: SettingsIcon,
    title: "Settings",
    children: [
      {
        title: "Whatsapp Msgs",
        href: "/merchant/settings/whatsapp"
      },
      {
        title: "Language",
        href: "/merchant/settings/language"
      }
    ]
  },
];

const DashboardSidebar = ({ onMobileClose, openMobile, merchant }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { roleType } = AuthService.getCurrentUser();
  const navigationConfig = [
    {
      title: 'MerchantSidebar',
      pages: roleType === "BASIC" ? items : itemsForShippingCompanies,
    }
  ];

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const [status, setStatus] = useState();

  useEffect(_ => {
    getStatus()
  }, [])

  const getStatus = async _ => {
    try {
      const response = await HttpService.get(`${apiUrl}/v1/merchant-dashboard/status`);
      const { currentStatus } = response.data.body;
      setStatus(currentStatus);
    } catch (e) {
      console.log(e);
    }
  }

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
          pt: 2,
        }}
        bgcolor="main.dark"
      >
        <Typography color="text.white" variant="subtitle1">
          {t("Welcome")}
        </Typography>
        <Typography color="text.white" variant="h1" mb={1} sx={{ textAlign: 'center' }}>
          {merchant.companyName}
        </Typography>
        <Box
          // square={false}
          sx={{
            width: "100px",
            height: "100px",
            mb: "-50px",
            borderRadius: "50px",
          }}
          bgcolor="main.dark"
        >
          <Avatar
            component={RouterLink}
            src={generateCloudinaryLink(merchant.logo)}
            sx={{
              cursor: "pointer",
              width: "86px",
              height: "86px",
              m: "7px",
            }}
            to="/merchant/account"
          >
            <BusinessIcon sx={{ width: "60px", height: "60px" }} />
          </Avatar>
        </Box>
      </Box>
      {/* <Divider /> */}
      {
        !!status && status !== "ACTIVE" &&
        <Typography variant="h6" sx={{ mt: 7.25, mb: 1, mx: 1, textAlign: 'center' }}>
          {t(`sidebarStatusDisclaimer.${status}.lineOne`)}<br />
          {t(`sidebarStatusDisclaimer.${status}.lineTwoPartOne`)}
          <Link href='https://web.whatsapp.com/send?phone=+966581849999' variant="h6" sx={{color: "text.primary", cursor: 'pointer' }}>
            {t(`sidebarStatusDisclaimer.${status}.lineTwoPartTwo`)}
          </Link>
        </Typography>
      }
      <Box sx={{ p: 2, mt: (!!status && status !== "ACTIVE") ? 0 : 6.25 }}>
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
