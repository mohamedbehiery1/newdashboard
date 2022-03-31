import {
  Box,
  Button
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthService from "src/__services__/AuthService";

const SubmerchantListToolbar = (props) => {
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
        <Button
          component={RouterLink}
          to={`/${role}/submerchants/add`}
          sx={{ textTransform: "none" }}
          color="main"
          variant="contained"
        >
          {t('Add Merchant')}
        </Button>
      </Box>
    </Box>
  );
};

export default SubmerchantListToolbar;
