import {
  Box,
  Typography,
  Button
} from "@material-ui/core";
// import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderListToolbar = (props) => {
  const { t } = useTranslation();
  
  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Typography m={2} component="h1" variant="h2">
          {t('Orders Follow up')}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderListToolbar;
