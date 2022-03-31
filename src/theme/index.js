import { colors } from "@material-ui/core";
import { createTheme } from '@material-ui/core/styles'
import shadows from "./shadows";
import typography from "./typography";

const theme = createTheme({
  direction: "rtl",
  palette: {
    background: {
      default: "#F4F6F8",
      paper: colors.common.white,
    },
    primary: {
      contrastText: "#ffffff",
      main: "#00588C",
    },
    secondary: {
      contrastText: "#ffffff",
      main: "#00588C",
    },
    main: {
      contrastText: "#ffffff",
      // main: "#2B4B76",
      // dark: "#223E65",
      main: "#00588C",
      dark: "#054c75",
    },
    map: {
      main: "#FFFFFF",
      contrastText: "#333333"
    },
    orange: {
      contrastText: "#ffffff",
      main: "#FC9E16",
    },
    green: {
      contrastText: "#ffffff",
      main: "#8EE835",
    },
    red: {
      contrastText: "#ffffff",
      main: "#FA0606",
    },
    text: {
      primary: "#172b4d",
      secondary: "#6b778c",
      // orange: "#FC9E16",
      orange: "#FAB707",
      white: "#ffffff",
      placeholder: "#C7C7C7",
      title: "#6E6E6E",
      danger: "#cf160c",
      success: "#28a745",
      mainstyle: "#00588C"
    },
    navItem: {
      bgActive: "#E2E2E2",
    },
    danger: {
      contrastText: "#ffffff",
      main: "#cf160c",
    },
    white: {
      main: '#FFFFFF'
    },
    yellow: {
      contrastText: "#ffffff",
      main: "#FAB707",
    },
  },
  shadows,
  typography: {
    ...typography,
    fontFamily: "Dubai, AraHamah1964, Arial",
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "start",
          fontSize: 18,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 18,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#00588C"
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        action: {
          alignSelf: 'center',
        },
      },
    },
    'MuiDataGrid': {
      styleOverrides: {
        cell: {
          columnHeaderCheckbox: {
            color: '#00588C'
          }
        }
      }
    }
  },
});

export default theme;
