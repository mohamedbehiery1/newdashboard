import moment from "moment";
import 'moment/locale/ar';
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";

const user = {
  // avatar: '/static/images/avatars/avatar_6.png',
  city: "Riyadh",
  country: "Saudi Arabia",
  jobTitle: "Senior Developer",
  name: "Namshi",
  timezone: "GMT+3",
};

const MerchantLogo = (props) => {
  const { t } = useTranslation();

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 100,
              width: 100,
              mb: 1.5,
            }}
          />
          <Typography color="textPrimary" variant="h2">
            {user.name}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {`${user.city}, ${user.country}`}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {`${moment().format("hh:mm A")} ${user.timezone}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="main" sx={{ fontWeight: 500 }} fullWidth variant="text">
          {t("Upload picture")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default MerchantLogo;
