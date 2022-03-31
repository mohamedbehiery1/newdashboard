import {
  Box,
  Button
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthService from "src/__services__/AuthService";

const DriverListToolbar = (props) => {
  const { t } = useTranslation();
  const { role } = AuthService.getCurrentUser();

  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {
          role === 'merchant' &&
          <Button
            component={RouterLink}
            to={`/${role}/drivers/track`}
            sx={{ textTransform: "none", mx: 2 }}
            color="main"
            variant="contained"
          >
            {t('Track Drivers')}
          </Button>
        }
        <Button
          component={RouterLink}
          to={`/${role}/drivers/add`}
          sx={{ textTransform: "none" }}
          color="main"
          variant="contained"
        >
          {t('Add Driver')}
        </Button>
      </Box>
    </Box>
  );
};

export default DriverListToolbar;
