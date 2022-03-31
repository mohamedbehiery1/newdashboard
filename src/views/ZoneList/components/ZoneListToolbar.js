import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";
import { useTranslation } from "react-i18next";

const ZoneListToolbar = (props) => {
  const { t } = useTranslation();
  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {/* <Button color="main">Import</Button>
      <Button color="main" sx={{ mx: 1 }}>
        Export
      </Button> */}
        {/* <Button sx={{ textTransform: "none" }} color="main" variant="contained">
        New Order
      </Button> */}
      </Box>
      <Box /*sx={{ mt: 3 }}*/>
        <Card>
          <CardContent>
            <Box>
              <TextField
                fullWidth
                InputProps={{
                  sx: { paddingInline: 10 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder={t("البحث عن مدير")}
                variant="outlined"
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ZoneListToolbar;
