import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import MobileNavbar from "./MobileNavbar";
import { useTranslation } from 'react-i18next';
import PropTypes from "prop-types";

const MobileLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const MobileLayoutWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 56,
}));

const MobileLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const MobileLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

const MobileLayout = ({ navbarColor, logoType, isDriver, ...props }) => {
  const { i18n } = useTranslation();

  return (
    <MobileLayoutRoot>
      <MobileNavbar
        bgColor={navbarColor}
        logoType={logoType}
        isDriver={isDriver}
      />
      <MobileLayoutWrapper>
        <MobileLayoutContainer>
          <MobileLayoutContent>
            <Outlet />
          </MobileLayoutContent>
        </MobileLayoutContainer>
      </MobileLayoutWrapper>
    </MobileLayoutRoot>
  );
};

MobileLayout.propTypes = {
  navbarColor: PropTypes.string,
  isDriver: PropTypes.bool
};

export default MobileLayout;
