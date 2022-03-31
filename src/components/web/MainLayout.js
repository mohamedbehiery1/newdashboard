import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import MainNavbar from "./MainNavbar";
import MainNavbarEnhanced from "./MainNavbarEnhanced";

const MainLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const MainLayoutWrapper = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  // paddingTop: 64,
});

const MainLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const MainLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

const MainLayout = (props) => {
  return (
    <MainLayoutRoot>
      {props.navbarVisible && <MainNavbarEnhanced />}
      <MainLayoutWrapper sx={{ pt: props.navbarVisible ? "64px" : 0 }}>
        <MainLayoutContainer >
          <MainLayoutContent sx={{ pt: '48px' }}>
            <Outlet />
          </MainLayoutContent>
        </MainLayoutContainer>
      </MainLayoutWrapper>
    </MainLayoutRoot>
  );
};

export default MainLayout;
