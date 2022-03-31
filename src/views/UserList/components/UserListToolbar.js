import {
  Box,
  Typography,
  Button
} from "@material-ui/core";
// import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserListToolbar = (props) => {
  const { t } = useTranslation();
  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Typography m={2} component="h1" variant="h2">
          {t("Users")}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListToolbar;
