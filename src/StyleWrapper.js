import React from "react";
import "@fontsource/roboto";
import "src/i18n";
import "react-perfect-scrollbar/dist/css/styles.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import GlobalStyles from "./components/GlobalStyles";
import theme from "./theme";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useLayoutEffect } from "react";
import { useTranslation } from 'react-i18next';

const StyleWrapper = (props) => {

  const { i18n } = useTranslation();

  const layoutDirection = i18n.dir(i18n.language);

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: layoutDirection === "rtl" ? [rtlPlugin] : [],
  });

  useLayoutEffect(() => {
    document.body.setAttribute("dir", layoutDirection);
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={{ ...theme, direction: layoutDirection }}>
        <CssBaseline />
        <GlobalStyles />
        {props.children}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default StyleWrapper;
