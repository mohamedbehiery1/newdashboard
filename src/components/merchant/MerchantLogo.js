import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Icon,
  SvgIcon
} from "@material-ui/core";
import { isValidBase64ImageString } from "src/__utils__/base64Utils";
import generateCloudinaryLink from 'src/__utils__/generateCloudinaryLink';
import BusinessIcon from '@material-ui/icons/Business';

const MerchantLogo = ({ logo, handleChange, error, variant, imgProps, ...props }) => {

  const { t } = useTranslation();

  const [source, setSource] = useState();

  useEffect(() => {
    if (!logo) return
    if (isValidBase64ImageString(logo))
      setSource(logo)
    else
      setSource(
        generateCloudinaryLink(logo)
      )
  }, [logo])

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
            src={source}
            sx={{
              height: 125,
              width: 125,
              // mb: 1,
              justifyContent: ''
            }}
            variant={variant}
            imgProps={imgProps}
          >
            <BusinessIcon sx={{ fontSize: 100 }} />
          </Avatar>
          {
            error &&
            <Typography color='text.danger' mx={1} variant="subtitle2">
              {error}
            </Typography>
          }
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="main" sx={{ fontWeight: 'bold' }} fullWidth component="label">
          {t("Choose Logo")}
          <input
            hidden
            name="file"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </Button>
      </CardActions>
    </Card >
  );
};

export default MerchantLogo;
