import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import AuthService from "src/__services__/AuthService";
import { useNavigate } from 'react-router-dom';

const DashboardLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const DashboardLayoutWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingInlineStart: 256,
  },
}));

const DashboardLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const DashboardLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

const AdminDashboardLayout = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  const logOut = () => {
    AuthService.logout();
    navigate("/auth/admin", { replace: true });
  }

  useEffect(() => {
    const { id, name, email } = {'id': 1, 'name': 'Admin', 'email': 'mohamedbehiery@icloud.com'}
    if (id) setAdmin({ id, name, email })

    const token = AuthService.getJwt();
    const isValid = AuthService.isJwtValid(token);
    if (!isValid) logOut();
  }, []);

  return (
    <DashboardLayoutRoot>
      <DashboardNavbar
        onMobileNavOpen={() => {
          setMobileNavOpen(true);
        }}
      />
      <DashboardSidebar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        admin={admin}
      />
      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            <Outlet />
          </DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
};

export default AdminDashboardLayout;
