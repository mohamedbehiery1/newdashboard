import React from "react";
import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import boxes from "../../assets/boxes.jpeg";
import { Box } from "@material-ui/system";

const MainLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  background: `linear-gradient(rgba(23, 85, 142, 0.75), rgba(23, 85, 142, 0.75)), url(${boxes})`,  /* Chrome 10-25, Safari 5.1-6 */
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  paddingBlock: 16,
  display: 'flex',
  alignItems: 'center',
  overflow: 'scroll',
}));

// const MainLayoutContainer = experimentalStyled("div")(({ theme }) => ({
//   width: '100%',
//   height: '100%',

// }));

const AuthLayout = () => {
  return (
    <MainLayoutRoot>
      {/* <MainLayoutContainer> */}
        <Outlet />
      {/* </MainLayoutContainer> */}
    </MainLayoutRoot>
  );
};

export default AuthLayout;
