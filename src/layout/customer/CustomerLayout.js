import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import CustomerNavbar from "./CustomerNavbar";
import PropTypes from "prop-types";

const CustomerLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const CustomerLayoutWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 56,
}));

const CustomerLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const CustomerLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

const CustomerLayout = ({ navbarColor, logoType, isDriver, ...props }) => (
  <CustomerLayoutRoot>
    <CustomerNavbar
      bgColor={navbarColor}
      logoType={logoType}
      isDriver={isDriver}
    />
    <CustomerLayoutWrapper>
      <CustomerLayoutContainer>
        <CustomerLayoutContent>
          <Outlet />
        </CustomerLayoutContent>
      </CustomerLayoutContainer>
    </CustomerLayoutWrapper>
  </CustomerLayoutRoot>
);

CustomerLayout.propTypes = {
  navbarColor: PropTypes.string,
  isDriver: PropTypes.bool
};

export default CustomerLayout;
