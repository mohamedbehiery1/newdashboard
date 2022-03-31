import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import LocationNavbar from "./LocationNavbar";
import { useTranslation } from 'react-i18next';
import PropTypes from "prop-types";

const LocationLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const LocationLayoutWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 56,
}));

const LocationLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const LocationLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

const LocationLayout = ({ navbarColor, logoType, isDriver, ...props }) => {
  const { i18n } = useTranslation();

  return (
    <LocationLayoutRoot>
      <LocationNavbar
        bgColor={navbarColor}
        logoType={logoType}
        isDriver={isDriver}
      />
      <LocationLayoutWrapper>
        <LocationLayoutContainer>
          <LocationLayoutContent>
            <Outlet />
          </LocationLayoutContent>
        </LocationLayoutContainer>
      </LocationLayoutWrapper>
    </LocationLayoutRoot>
  );
};

LocationLayout.propTypes = {
  navbarColor: PropTypes.string,
  isDriver: PropTypes.bool
};

export default LocationLayout;
